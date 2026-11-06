import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes except login UI itself and api/login endpoints
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/api/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/admin/:path*'],
};
