"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface Case {
    id: number;
    text: string;
    riskLevel: string;
    score: number;
    flags: string;
    status: string;
    notes: string | null;
    firDraft: string | null;
    createdAt: Date;
}

interface AdminDashboardClientProps {
    stats: any;
    cases: Case[];
    updateCaseAction: (id: number, status: string, notes: string) => Promise<void>;
}

export default function AdminDashboardClient({ stats, cases, updateCaseAction }: AdminDashboardClientProps) {
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCases = cases.filter(c =>
        c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toString().includes(searchTerm) ||
        c.riskLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const chartData = [
        { name: "Low", value: stats.lowCases, color: "#10b981" },
        { name: "Medium", value: stats.mediumCases, color: "#eab308" },
        { name: "High", value: stats.highCases, color: "#f97316" },
        { name: "Critical", value: stats.criticalCases, color: "#ef4444" },
    ];

    const handleSelectCase = (c: Case) => {
        setSelectedCase(c);
        setNote(c.notes || "");
    };

    const handleSave = async (status: string) => {
        if (!selectedCase) return;
        setSaving(true);
        await updateCaseAction(selectedCase.id, status, note);
        setSaving(false);
        // Optimistically update local state or just let revalidatePath handle it? 
        // Since we are in client component but props come from server, props won't update instantly unless we router.refresh().
        // But for now, simple feedback is enough.
        alert("Case updated successfully!");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="h-[400px]">
                    <CardHeader>
                        <CardTitle>Scam Risk Distribution</CardTitle>
                        <CardDescription>Analysis of reported cases by risk level</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Searchable Case Table */}
                <Card className="min-h-[500px]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Case Management</CardTitle>
                                <CardDescription>Search and manage reported scam cases</CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search cases..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-border overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                                    <tr>
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Snippet</th>
                                        <th className="p-3">Risk Level</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredCases.length > 0 ? (
                                        filteredCases.map((c) => (
                                            <tr
                                                key={c.id}
                                                className={cn(
                                                    "hover:bg-muted/30 transition-colors cursor-pointer",
                                                    selectedCase?.id === c.id && "bg-primary/5"
                                                )}
                                                onClick={() => handleSelectCase(c)}
                                            >
                                                <td className="p-3 font-mono">#{c.id}</td>
                                                <td className="p-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3 max-w-[200px] truncate text-muted-foreground">"{c.text}"</td>
                                                <td className="p-3">
                                                    <Badge variant={
                                                        c.riskLevel === 'Critical' ? 'destructive' :
                                                            c.riskLevel === 'High' ? 'danger' :
                                                                c.riskLevel === 'Medium' ? 'warning' : 'safe'
                                                    }>{c.riskLevel}</Badge>
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="outline" className="text-xs">{c.status}</Badge>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open</span>
                                                        <Search className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                No cases found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Case Details Sidebar */}
            <div className="lg:col-span-1">
                {selectedCase ? (
                    <Card className="sticky top-8 h-fit max-h-[calc(100vh-4rem)] overflow-auto glass-card border-primary/20">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>Case #{selectedCase.id}</CardTitle>
                                <div className="p-2 rounded-full border border-border bg-background">
                                    <span className="text-xl font-bold">{selectedCase.score}</span>
                                </div>
                            </div>
                            <CardDescription>Risk Score / 100</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Message Content</h4>
                                <div className="p-3 rounded-md bg-muted/30 text-sm italic border border-border">
                                    "{selectedCase.text}"
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Detected Flags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {JSON.parse(selectedCase.flags).map((flag: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{flag}</Badge>
                                    ))}
                                </div>
                            </div>

                            {selectedCase.firDraft && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">FIR Draft</h4>
                                    <pre className="text-xs bg-black/40 p-2 rounded border border-border overflow-x-auto whitespace-pre-wrap">
                                        {selectedCase.firDraft.substring(0, 150)}...
                                    </pre>
                                </div>
                            )}

                            <div className="pt-4 border-t border-border space-y-4">
                                <h4 className="font-semibold text-primary">Department Actions</h4>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Case Notes</label>
                                    <Textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add internal notes here..."
                                        className="bg-background/80"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="neutral"
                                        className="w-full bg-slate-700 hover:bg-slate-600"
                                        onClick={() => handleSave("Reviewed")}
                                        disabled={saving}
                                    >
                                        Mark Reviewed
                                    </Button>
                                    <Button
                                        variant="neon"
                                        className="w-full"
                                        onClick={() => handleSave("Action Taken")}
                                        disabled={saving}
                                    >
                                        Take Action
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-muted rounded-xl bg-muted/5">
                        <div className="text-center text-muted-foreground">
                            <p>Select a case to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
