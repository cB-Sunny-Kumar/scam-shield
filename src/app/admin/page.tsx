import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardStats, getCases, logoutAction, updateCaseAction } from "@/app/actions";
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
        <div className="animate-fade-in">
            <AdminDashboardClient stats={stats} cases={cases} updateCaseAction={updateCaseAction} />
        </div>
    );
}

