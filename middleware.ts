import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = request.nextUrl;

    // Public routes allowed without authentication
    const publicRoutes = ['/sign-in', '/login', '/api'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If visiting /login, rewrite to /sign-in (so both work)
    if (pathname === '/login') {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        return NextResponse.rewrite(url);
    }

    // If not authenticated and not on a public route, redirect to /login
    if (!token && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // If authenticated and trying to access sign-in/login, send to home
    if (token && (pathname === '/sign-in' || pathname === '/login')) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Attach admin info to the request
    if (token && token.email === process.env.NEXTAUTH_ADMIN_EMAIL) {
        request.headers.set('X-Is-Admin', 'true');
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/sign-in',
        '/login',
        '/display/:path*',
        '/product/:path*',
        '/upload/:path*',
        '/wishlist/:path*',
        '/chat/:path*',
        '/Profile/:path*'
    ],
};
