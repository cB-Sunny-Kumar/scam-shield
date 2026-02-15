"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        Scam Shield
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {isAdmin ? (
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                <Home className="w-4 h-4" />
                                Back to Home
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/admin">
                            <Button variant="outline" size="sm" className="gap-2 bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary">
                                <Lock className="w-4 h-4" />
                                Department Portal
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
