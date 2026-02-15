"use client";

import { Button } from "./button";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";

export function LogoutButton() {
    return (
        <form action={logoutAction}>
            <Button variant="ghost" type="submit" size="sm" className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
        </form>
    );
}
