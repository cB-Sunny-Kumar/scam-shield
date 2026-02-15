"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (formData: FormData) => {
        setLoading(true);
        setError("");

        const result = await loginAction(formData);

        if (result.success) {
            router.push("/admin");
        } else {
            setError(result.error || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-primary/20 shadow-lg glass-card">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/20 w-fit">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>Department Login</CardTitle>
                    <CardDescription>Restricted access for authorized personnel only.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter Secure Password"
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 glass"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Authenticating..." : "Access Dashboard"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-xs text-muted-foreground">Scam Shield Admin Portal v1.0</p>
                </CardFooter>
            </Card>
        </div>
    );
}
