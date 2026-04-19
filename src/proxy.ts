import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  // Public routes that don't need auth
  const isAuthPage = pathname.startsWith('/auth');

  // Protected routes: /cart, /checkout, /orders, /account, /admin/*
  const isProtectedRoute = 
    pathname.startsWith('/cart') || 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/orders') || 
    pathname.startsWith('/account') || 
    pathname.startsWith('/admin');

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect away from login/register if already logged in
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
