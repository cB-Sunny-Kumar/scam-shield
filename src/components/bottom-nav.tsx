"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Shield, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";

const NAV_ITEMS = [
    { label: "Scan", icon: Shield, href: "/" },
    { label: "Admin", icon: LayoutDashboard, href: "/admin" },
    { label: "Settings", icon: Settings, href: "#" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 lg:hidden glass-panel rounded-2xl flex items-center justify-around px-4 z-50 border-primary/20 shadow-2xl">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
                            isActive
                                ? "text-primary scale-110"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-medium mt-1">{item.label}</span>
                    </Link>
                );
            })}

            {pathname.startsWith("/admin") && (
                <form action={logoutAction} className="flex flex-col items-center justify-center">
                    <button type="submit" className="flex flex-col items-center text-muted-foreground hover:text-red-400">
                        <LogOut className="w-6 h-6" />
                        <span className="text-[10px] font-medium mt-1">Logout</span>
                    </button>
                </form>
            )}
        </nav>

    );
}
