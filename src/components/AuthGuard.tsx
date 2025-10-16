'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminAuth, getAdminUser, clearAdminAuth } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      // Only check auth on client side
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }
      
      try {
        const auth = checkAdminAuth()
        const user = getAdminUser()
        
        console.log('AuthGuard - Auth check:', { 
          auth, 
          user: !!user,
          adminAuth: localStorage.getItem('adminAuth'),
          hasToken: !!localStorage.getItem('adminToken'),
          hasUser: !!localStorage.getItem('adminUser')
        })
        
        if (auth && user) {
          setIsAuthenticated(true)
        } else {
          console.log('AuthGuard - Auth failed, redirecting to login')
          clearAdminAuth()
          router.push('/')
        }
      } catch (error) {
        console.error('AuthGuard - Auth check error:', error)
        clearAdminAuth()
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    // Add a delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 300)
    return () => clearTimeout(timer)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600 mb-4">Please log in to access the dashboard</p>
          <button
            onClick={() => {
              console.log('Go to Login button clicked')
              try {
                router.push('/')
              } catch (error) {
                console.error('Navigation error:', error)
                // Fallback to window.location
                window.location.href = '/'
              }
            }}
            className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
