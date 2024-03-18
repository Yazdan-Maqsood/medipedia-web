// This example assumes you're using the new Middleware (file-based routing) in Next.js 14.

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// This is your secret from NextAuth configuration. Ensure it matches.
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
    const session = await getToken({ req, secret });
   
    if (session) {
        
        return NextResponse.redirect(new URL('/forgot-password', request.nextUrl));

    }else{
        
        return NextResponse.redirect(new URL('/guide', request.nextUrl));


    }

    // Continue to the requested page if session exists or if it's a public path
    return NextResponse.next();
}
