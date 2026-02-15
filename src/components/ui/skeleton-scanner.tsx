"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonScanner() {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <Card className="md:col-span-2 glass-panel border-white/5 h-48">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="h-6 w-32 bg-white/10 rounded" />
                    <div className="h-6 w-24 bg-white/10 rounded" />
                </CardHeader>
                <CardContent className="flex items-center gap-8">
                    <div className="h-24 w-24 rounded-full border-8 border-white/5 flex-shrink-0" />
                    <div className="flex-1 space-y-4">
                        <div className="h-4 w-full bg-white/10 rounded" />
                        <div className="h-8 w-full bg-white/5 rounded" />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-panel border-white/5 h-64">
                <CardHeader><div className="h-6 w-40 bg-white/10 rounded" /></CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                </CardContent>
            </Card>

            <Card className="glass-panel border-white/5 h-64">
                <CardHeader><div className="h-6 w-32 bg-white/10 rounded" /></CardHeader>
                <CardContent className="h-32 bg-white/5 rounded mx-6" />
            </Card>
        </div>
    );
}
