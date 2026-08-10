import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

// Routes that only make sense when logged OUT.
const guestOnlyRoutes = ["/login", "/register", "/forgot-password"];

// Routes that require a session.
const protectedRoutes = [
    "/apply-code",
    "/book-code",
    "/book-price",
    "/change-email",
    "/change-password",
    "/change-phone-number",
    "/change-profile-name",
    "/feedback",
    "/guide",
    "/hints",
    "/profile",
    "/quiz",
    "/saved-quiz",
    "/search",
    "/success",
];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    const basePath = "/" + (pathname.split("/")[1] || "");

    const isProtected = protectedRoutes.includes(basePath);
    const isGuestOnly = guestOnlyRoutes.includes(basePath);

    if (!isProtected && !isGuestOnly) {
        return NextResponse.next();
    }

    // ✅ FIXED: Let NextAuth handle the secureCookie logic automatically. 
    // Manual overrides often break on Vercel due to missing NEXTAUTH_URL.
    const token = await getToken({ 
        req, 
        secret 
    });

    if (token && isGuestOnly) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (!token && isProtected) {
        const loginUrl = new URL("/login", req.nextUrl);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
};