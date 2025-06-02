// src/app/AppWrapper.tsx (Client Component)
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

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

    // Show simple loading while session is being determined
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Only block rendering if user is unauthenticated on a protected route
    if (status === "unauthenticated" && isProtectedRoute) {
        return null;
    }

    return <div className="min-h-screen">{children}</div>;
}
