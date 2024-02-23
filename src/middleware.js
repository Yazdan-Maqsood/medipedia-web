import { NextResponse } from 'next/server';

export async function middleware(request) {
  let cookie = request.cookies.get('next-auth.session-token');

  // Ensure the list includes all the routes you want to protect or require authentication
  const authenticatedRoutes = ['/login', '/register', '/forgot-password'];
  const nonAuthRoutesPatterns = [
    '/apply-code',
    '/book-code',
    '/book-price',
    '/change-email',
    '/change-password',
    '/change-phone-number',
    '/change-profile-name',
    '/guide',
    '/hints',
    '/profile',
    '/quiz',
    '/saved-quiz',
    '/search',
    '/success',
];

  const pathname = request.nextUrl.pathname;
  const basePath = pathname.split('/')[1]; // This assumes your paths are directly under the root

  // Debug: Log values for troubleshooting (remove in final code for production)
  console.log(`Pathname: ${pathname}, BasePath: ${basePath}, Cookie: ${cookie}`);

  const isNonAuthRoute = nonAuthRoutesPatterns.some(route => `/${basePath}`.startsWith(route));
  const isAuthRoute = authenticatedRoutes.includes(pathname); // Adjusted for exact match

  if (cookie && isAuthRoute) {
    // Redirect authenticated users away from auth routes
    return NextResponse.redirect(new URL('/', request.nextUrl));
  } else if (!cookie && !isNonAuthRoute) {
    // Redirect unauthenticated users to login from non-auth routes
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Proceed with request for all other cases
  return NextResponse.next();
}
