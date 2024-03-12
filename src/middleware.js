// middleware.ts
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
// paths that require authentication or authorization
// const requireAuth = ["/feedback"]
export async function middleware(request) {
  const res = NextResponse.next()
  const pathname = request.nextUrl.pathname
//   if (requireAuth.some(path => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    //check not logged in
    if (!token) {
    
     console.log("noooooooo")
    }
    //check if not authorized
    if (token) {
        console.log("yesssssssssssssssss")
    }
  //}
  return NextResponse.next();
}
