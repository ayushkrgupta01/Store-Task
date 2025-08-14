import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path starts with /admin (excluding /adminLogin)
  if (path.startsWith('/admin') && path !== '/adminLogin') {
    // Check for admin token in cookies
    const adminToken = request.cookies.get('adminToken');
    
    if (!adminToken) {
      // Redirect to root (which is now the admin login) if no token found
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If accessing root page (admin login) and already has token, redirect to admin dashboard
  if (path === '/' || path === '/adminLogin') {
    const adminToken = request.cookies.get('adminToken');
    
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/adminLogin']
};
