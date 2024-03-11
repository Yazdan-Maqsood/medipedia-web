import { NextResponse } from 'next/server';

export async function middleware(request) {
  //let cookie = request.cookies.get('next-auth.session-token');
  let cookie = request.cookies.get('__Secure-next-auth.session-token');

  const authenticatedRoutes = ['/login', '/register','/forgot-password'];
  const nonAuthRoutesPatterns = [
      '/apply-code',
      '/book-code',
      '/book-price',
      '/change-email',
      '/change-password',
      '/change-phone-number',
      '/change-profile-name',
      '/about/:path*',
      '/hints',
      '/profile',
      '/quiz',
      '/saved-quiz',
      '/search',
      '/success',
  ];

  // Use nextUrl.pathname for Next.js versions that support it
  const pathname = request.nextUrl.pathname;

  // Logic for determining if the pathname matches authenticated or non-authenticated routes
  const basePath = pathname.split('/')[1]; // Gets the first segment of the path

  const isNonAuthRoute = nonAuthRoutesPatterns.some(route => `/${basePath}`.startsWith(route));
  const isAuthRoute = authenticatedRoutes.some(route => `/${basePath}`.startsWith(route));

  if (cookie && isAuthRoute) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
  } else if (!cookie && isNonAuthRoute) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}