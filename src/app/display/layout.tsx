import React from "react";
import Navbar from "@/components/Display/nav";

export const metadata = {
    title: "Browse Products | SellItDude",
    description: "Discover products listed by fellow students",
};

export default function DisplayLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
} 