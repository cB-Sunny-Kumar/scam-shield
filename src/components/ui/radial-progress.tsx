"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RadialProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    riskLevel: "Low" | "Medium" | "High" | "Critical";
}

export function RadialProgress({
    value,
    size = 120,
    strokeWidth = 10,
    className,
    riskLevel
}: RadialProgressProps) {
    const [offset, setOffset] = useState(0);
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const progressOffset = ((100 - value) / 100) * circumference;
        setOffset(progressOffset);
    }, [value, circumference]);

    const getColor = () => {
        switch (riskLevel) {
            case "Critical": return "text-red-500 shadow-red-500/50";
            case "High": return "text-orange-500 shadow-orange-500/50";
            case "Medium": return "text-yellow-500 shadow-yellow-500/50";
            default: return "text-emerald-500 shadow-emerald-500/50";
        }
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                {/* Background Circle */}
                <circle
                    className="text-white/5"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                />
                {/* Progress Circle */}
                <circle
                    className={cn("transition-all duration-1000 ease-out", getColor())}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                    style={{
                        filter: `drop-shadow(0 0 8px currentColor)`
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono leading-none">{value}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-70">Score</span>
            </div>
        </div>
    );
}
