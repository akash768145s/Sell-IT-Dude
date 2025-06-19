import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request) {
    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            return NextResponse.json({ isAdmin: false }, { status: 200 });
        }

        const isAdmin = token.email === process.env.NEXTAUTH_ADMIN_EMAIL;

        return NextResponse.json({ isAdmin }, { status: 200 });
    } catch (error) {
        console.error("Error checking admin status:", error);
        return NextResponse.json({ isAdmin: false }, { status: 500 });
    }
} 