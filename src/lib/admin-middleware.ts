import { NextRequest, NextResponse } from 'next/server'

export async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get('adminToken')?.value
    
    if (!token) {
      return false
    }

    const response = await fetch('https://agency-backend-pi.vercel.app/api/v1/admin/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}

export function withAdminAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const isAuthenticated = await verifyAdminToken(request)
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    return handler(request)
  }
}
