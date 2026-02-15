import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardStats, getCases, logoutAction, updateCaseAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, LogOut, CheckCircle, AlertTriangle, FileText, Activity } from "lucide-react";
import AdminDashboardClient from "@/components/admin-dashboard-client";

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session) {
        redirect("/admin/login");
    }

    const stats = await getDashboardStats();
    const cases = await getCases();

    return (
        <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <ShieldAlert className="w-8 h-8 text-primary" /> Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground">Overview of reported scam incidents</p>
                </div>
                <form action={logoutAction}>
                    <Button variant="outline" type="submit">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </form>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-card/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCases}</div>
                        <p className="text-xs text-muted-foreground">+ from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-400">Critical Threats</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{stats.criticalCases}</div>
                        <p className="text-xs text-red-400/70">Requiring immediate action</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-500/10 border-yellow-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-400">Pending Review</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{stats.pendingCases}</div>
                        <p className="text-xs text-yellow-400/70">New submissions</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-400">Action Taken</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {/* Approximate, could calculate real closed cases */}
                            {stats.totalCases - stats.pendingCases}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AdminDashboardClient stats={stats} cases={cases} updateCaseAction={updateCaseAction} />
        </div>
    );
}
