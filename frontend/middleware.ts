// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get JWT token from cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/tasks', '/dashboard', '/profile'];

  // Check if the current route starts with one of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Specify which paths the middleware applies to.
export const config = {
  matcher: ['/tasks/:path*', '/dashboard/:path*', '/profile/:path*'],
};
