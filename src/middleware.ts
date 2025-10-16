import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Skip middleware for API routes
  if (path.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if the user is trying to access the dashboard without authentication
  if (path.startsWith('/dashboard')) {
    // Check for admin authentication in cookies
    const adminAuth = request.cookies.get('adminAuth')?.value
    const adminToken = request.cookies.get('adminToken')?.value
    
    // If no admin authentication, redirect to login
    if (!adminAuth || !adminToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirect authenticated users away from login page
  if (path === '/') {
    const adminAuth = request.cookies.get('adminAuth')?.value
    const adminToken = request.cookies.get('adminToken')?.value
    
    if (adminAuth && adminToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
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
