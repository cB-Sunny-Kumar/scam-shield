"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Shield, LayoutDashboard, ShieldAlert, Settings, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";

const NAV_ITEMS = [
    { label: "Scanner", icon: Shield, href: "/" },
    { label: "Admin Portal", icon: LayoutDashboard, href: "/admin" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 h-[70vh] w-20 hidden lg:flex flex-col items-center py-8 glass-panel rounded-3xl z-50 transition-all duration-300 hover:w-56 group border-primary/10">
            <div className="mb-12 text-primary group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 fill-primary/20" />
            </div>

            <nav className="flex-1 flex flex-col gap-8 w-full px-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 p-3 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-primary text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <item.icon className="w-6 h-6 shrink-0" />
                            <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* Unified Logout for Admin */}
                {pathname.startsWith("/admin") && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="flex items-center gap-4 p-3 rounded-2xl w-full text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group/logout"
                            >
                                <LogOut className="w-6 h-6 shrink-0" />
                                <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                                    Terminate Session
                                </span>
                            </button>
                        </form>
                    </div>
                )}
            </nav>


            <div className="mt-auto w-full px-4 flex flex-col gap-4">
                <div className="p-3 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-2xl cursor-pointer group-hover:flex items-center gap-4">
                    <Settings className="w-6 h-6 shrink-0" />
                    <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity">Settings</span>
                </div>
            </div>
        </aside>
    );
}
