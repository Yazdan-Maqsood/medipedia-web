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
    // /feedback posts the logged-in user's id, so it belongs here. It was
    // reachable while logged out, where the submit handler threw on session.user.
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

    // `next.config.mjs` sets trailingSlash: true, so paths arrive as "/guide/".
    // Normalise before matching, otherwise "/guide/" never equals "/guide".
    const basePath = "/" + (pathname.split("/")[1] || "");

    const isProtected = protectedRoutes.includes(basePath);
    const isGuestOnly = guestOnlyRoutes.includes(basePath);

    // Nothing to decide -> skip the (relatively expensive) token decode.
    if (!isProtected && !isGuestOnly) {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret,
        // On Vercel the cookie is "__Secure-next-auth.session-token". getToken
        // infers this from NEXTAUTH_URL/VERCEL, but being explicit avoids the
        // "logged in but middleware says no" loop on custom domains.
        secureCookie:
            process.env.NEXTAUTH_URL?.startsWith("https://") ??
            process.env.NODE_ENV === "production",
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
    // Never run middleware on API routes (it would fight NextAuth's own
    // /api/auth/* endpoints), static assets, or image optimisation.
    matcher: [
        "/((?!api|_next/static|_next/image|assets|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
};
