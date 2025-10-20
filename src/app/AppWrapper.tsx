// src/app/AppWrapper.tsx (Client Component)
"use client";

import { useSession } from "next-auth/react";
import { PageLoading } from "@/components/ui/Loading";
import { SocketProvider } from "@/contexts/SocketContext";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    // Show friendly loading while session is being determined
    if (status === "loading") {
        return <PageLoading text="Setting up your session..." />;
    }

    return (
        <SocketProvider>
            <div className="min-h-screen">{children}</div>
        </SocketProvider>
    );
}
