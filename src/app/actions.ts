"use server";

import { analyzeFraudText, FraudAnalysisResult } from "@/lib/fraud-engine";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function analyzeTextAction(formData: FormData): Promise<FraudAnalysisResult> {
    const text = formData.get("text") as string;

    if (!text || typeof text !== "string") {
        throw new Error("Invalid input");
    }

    // Simulate AI delay for effect
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = analyzeFraudText(text);

    // Save to Database
    try {
        // Convert flags array to string
        const flagsString = JSON.stringify(result.flags);

        await db.case.create({
            data: {
                text,
                riskLevel: result.riskLevel,
                score: result.score,
                flags: flagsString,
                firDraft: result.firDraft,
                status: "Pending",
            },
        });

        revalidatePath("/admin");
    } catch (error) {
        console.error("Failed to save case to DB:", error);
        // We don't fail the user request if saving stats fails, but good to know.
    }

    return result;
}

export async function loginAction(formData: FormData) {
    const password = formData.get("password") as string;

    // Simple hardcoded password for demonstration
    if (password === "admin123") {
        // Set cookie
        (await cookies()).set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        return { success: true };
    }

    return { success: false, error: "Invalid password" };
}

export async function logoutAction() {
    (await cookies()).delete("admin_session");
    revalidatePath("/admin");
}

export async function getDashboardStats() {
    const totalCases = await db.case.count();
    const criticalCases = await db.case.count({ where: { riskLevel: "Critical" } });
    const highCases = await db.case.count({ where: { riskLevel: "High" } });
    const mediumCases = await db.case.count({ where: { riskLevel: "Medium" } });
    const lowCases = await db.case.count({ where: { riskLevel: "Low" } });
    const pendingCases = await db.case.count({ where: { status: "Pending" } });

    const recentCases = await db.case.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
    });

    return {
        totalCases,
        criticalCases,
        highCases,
        mediumCases,
        lowCases,
        pendingCases,
        recentCases,
    };
}

export async function getCases() {
    const cases = await db.case.findMany({
        orderBy: { createdAt: "desc" },
    });
    return cases;
}

export async function updateCaseAction(id: number, status: string, notes: string) {
    await db.case.update({
        where: { id },
        data: { status, notes },
    });
    revalidatePath("/admin");
}
