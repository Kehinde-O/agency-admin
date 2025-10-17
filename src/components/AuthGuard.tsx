'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAdminAuth, getAdminUser, verifyAdminToken, clearAdminAuth } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'OWNER'
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated locally
        const isAuth = checkAdminAuth()
        if (!isAuth) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Get user info
        const user = getAdminUser()
        if (!user) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Check role requirements
        if (requiredRole && user.role !== requiredRole && user.role !== 'OWNER') {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Verify token with backend
        const isTokenValid = await verifyAdminToken()
        if (!isTokenValid) {
          // Clear invalid auth data
          clearAdminAuth()
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        clearAdminAuth()
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredRole])

  // Show loading state (minimal)
  if (isLoading) {
    return null
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/')
    return null
  }

  // Render protected content
  return <>{children}</>
}