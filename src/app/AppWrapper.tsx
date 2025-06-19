// src/app/AppWrapper.tsx (Client Component)
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { PageLoading } from "@/components/ui/Loading";

// Routes that require authentication
const protectedRoutes = ['/upload', '/Profile', '/wishlist'];

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // Check if current route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    useEffect(() => {
        // Only redirect to sign-in if user is on a protected route and not authenticated
        if (status === "unauthenticated" && isProtectedRoute) {
            router.push("/sign-in");
        }
    }, [status, router, pathname, isProtectedRoute]);

    // Show friendly loading while session is being determined
    if (status === "loading") {
        return <PageLoading text="Setting up your session..." />;
    }

    // Only block rendering if user is unauthenticated on a protected route
    if (status === "unauthenticated" && isProtectedRoute) {
        return null;
    }

    return <div className="min-h-screen">{children}</div>;
}
