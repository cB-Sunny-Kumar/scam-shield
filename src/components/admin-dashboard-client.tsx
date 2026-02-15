"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Activity, ShieldAlert, Clock, Database, Maximize2, ExternalLink, Filter, AlertTriangle } from "lucide-react";

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
        try {
            await updateCaseAction(selectedCase.id, status, note);
            // Auto close modal and reset state
            setSelectedCase(null);
            setNote("");
        } catch (error) {
            console.error("Failed to update case:", error);
            alert("Failed to update case. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-fade-in">
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Database className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Neural Core Database</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Department <span className="text-primary">Portal</span></h1>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 px-4 rounded-2xl border border-white/5 shadow-inner">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Active Nodes</span>
                        <span className="text-sm font-mono font-bold text-primary">SCAN_SHIELD_V2.0</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <Activity className="w-5 h-5 text-primary animate-pulse" />
                </div>
            </div>

            {/* Top Stats HUD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Intercepts", val: stats.totalCases, icon: ShieldAlert, color: "text-blue-400" },
                    { label: "Critical Threats", val: stats.criticalCases, icon: ShieldAlert, color: "text-red-500" },
                    { label: "High Risk", val: stats.highCases, icon: AlertTriangle, color: "text-orange-500" },
                    { label: "Avg Risk Score", val: Math.round(stats.avgScore) || 0, icon: Clock, color: "text-emerald-500" },
                ].map((stat, i) => (
                    <Card key={i} className="glass-panel border-white/5 p-4 py-6 flex flex-col items-center gap-1 group hover:border-primary/30 transition-all duration-300">
                        <stat.icon className={cn("w-5 h-5 mb-2 opacity-50 group-hover:opacity-100 transition-opacity", stat.color)} />
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{stat.label}</span>
                        <span className="text-2xl font-black font-mono">{stat.val}</span>
                    </Card>
                ))}
            </div>

            {/* Bento Grid Content */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Risk Distribution Chart - Bento Item */}
                <Card className="xl:col-span-8 glass-panel border-white/5 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-4 px-6">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-primary" />
                            <div>
                                <CardTitle className="text-xs uppercase font-black tracking-widest">Risk Distribution Analysis</CardTitle>
                                <CardDescription className="text-[10px] tracking-wider uppercase opacity-50">Real-time threat landscape monitoring</CardDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg border border-white/5">
                            <Maximize2 className="h-4 w-4 opacity-50" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[300px] min-h-0 px-6">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    stroke="rgba(255,255,255,0.3)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.3)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Filters & Actions - Bento Item */}
                <Card className="xl:col-span-4 glass-panel border-white/5">
                    <CardHeader className="border-b border-white/5 mb-4">
                        <CardTitle className="text-[10px] uppercase font-black tracking-[0.2em]">Management Terminal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Global Intercept Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="CASE_ID / SOURCE_STR..."
                                    className="pl-10 bg-black/20 border-white/5 rounded-xl scan-text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5 grid grid-cols-1 gap-3">
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/5 hover:bg-white/5 group">
                                <Filter className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Toggle High-Risk Only</span>
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/5 hover:bg-white/5 group">
                                <ExternalLink className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Export Neural Data (JSON)</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Case Management HUD - Bento Item */}
                <Card className="xl:col-span-12 glass-panel border-white/5 min-h-[500px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-4">
                        <div>
                            <CardTitle className="text-xs uppercase font-black tracking-widest">Neural Intercept Log</CardTitle>
                            <CardDescription className="text-[10px] tracking-wider uppercase opacity-50">Authorized Personnel Only</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[9px] tracking-[0.2em] font-black">Secure Feed</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[9px] uppercase font-black tracking-widest text-muted-foreground bg-white/5 border-y border-white/5">
                                    <tr>
                                        <th className="p-4">Case_ID</th>
                                        <th className="p-4">Timestamp</th>
                                        <th className="p-4">Source_Transmission</th>
                                        <th className="p-4">Threat_Level</th>
                                        <th className="p-4 text-right">HUD_Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCases.length > 0 ? (
                                        filteredCases.map((c) => (
                                            <tr
                                                key={c.id}
                                                className={cn(
                                                    "group hover:bg-white/[0.02] transition-colors cursor-pointer",
                                                    selectedCase?.id === c.id && "bg-primary/[0.03]"
                                                )}
                                                onClick={() => handleSelectCase(c)}
                                            >
                                                <td className="p-4 font-mono font-bold text-xs text-primary/80">HEX#{c.id.toString(16).toUpperCase()}</td>
                                                <td className="p-4 text-[11px] text-muted-foreground font-mono">{new Date(c.createdAt).toLocaleString()}</td>
                                                <td className="p-4 max-w-[300px] truncate text-xs italic opacity-70 group-hover:opacity-100 transition-opacity">"{c.text}"</td>
                                                <td className="p-4">
                                                    <Badge variant={
                                                        c.riskLevel === 'Critical' ? 'destructive' :
                                                            c.riskLevel === 'High' ? 'danger' :
                                                                c.riskLevel === 'Medium' ? 'warning' : 'safe'
                                                    } className="text-[9px] font-black px-2 py-0.5 tracking-tighter uppercase">{c.riskLevel}</Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 group">
                                                        <Maximize2 className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-4 opacity-30">
                                                    <Database className="w-8 h-8" />
                                                    <p className="text-[10px] uppercase font-black tracking-widest">Null return on query search</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Case HUD Overlay/Sidebar (Desktop Only) */}
            {selectedCase && (
                <div className="fixed inset-0 lg:left-32 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCase(null)}>
                    <Card className="w-full max-w-2xl glass-panel border-primary/20 shadow-[0_0_100px_rgba(16,185,129,0.1)]" onClick={e => e.stopPropagation()}>
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Intercept_#{selectedCase.id.toString(16).toUpperCase()}</CardTitle>
                                <CardDescription className="text-xs uppercase tracking-widest font-bold text-primary">Neural Analysis Score: {selectedCase.score}</CardDescription>
                            </div>
                            <Button variant="ghost" onClick={() => setSelectedCase(null)} className="rounded-full h-8 w-8 p-0">×</Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6 max-h-[70vh] overflow-auto">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intercepted Transmission</h4>
                                <div className="p-4 rounded-xl bg-black/40 text-sm italic border border-white/5 scan-text leading-relaxed">
                                    "{selectedCase.text}"
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal Investigation Panel</h4>
                                <div className="space-y-3">
                                    <label className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Case Investigator Notes</label>
                                    <Textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Enter secure intelligence notes..."
                                        className="bg-black/40 border-white/5 rounded-xl scan-text min-h-[100px] text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="secondary"
                                        className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 bg-slate-800 hover:bg-slate-700"
                                        onClick={() => handleSave("Reviewed")}
                                        disabled={saving}
                                    >
                                        Mark Reviewed
                                    </Button>
                                    <Button
                                        variant="neon"
                                        className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11"
                                        onClick={() => handleSave("Action Taken")}
                                        disabled={saving}
                                    >
                                        Initiate Action
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

