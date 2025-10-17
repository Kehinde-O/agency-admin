import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for API routes, static files, and auth pages
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/favicon.ico') ||
    path === '/' ||
    path.startsWith('/login')
  ) {
    return NextResponse.next()
  }

  // Check for admin authentication on protected routes
  if (path.startsWith('/dashboard') || path.startsWith('/users') || path.startsWith('/properties') || path.startsWith('/pending-properties') || path.startsWith('/reports') || path.startsWith('/settings')) {
    // Check for admin token in cookies or headers
    const adminToken = request.cookies.get('adminToken')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!adminToken) {
      // Redirect to login if no token found
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
