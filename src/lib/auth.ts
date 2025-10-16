// Authentication utilities for admin dashboard

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'OWNER'
  status: string
  isAuthenticated: boolean
}

export const checkAdminAuth = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('adminAuth') === 'true' && !!localStorage.getItem('adminToken')
}

export const getAdminUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null
  
  const isAuth = checkAdminAuth()
  const userStr = localStorage.getItem('adminUser')
  
  if (isAuth && userStr) {
    try {
      const user = JSON.parse(userStr)
      return {
        ...user,
        isAuthenticated: true
      }
    } catch (error) {
      console.error('Error parsing admin user:', error)
      return null
    }
  }
  
  return null
}

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken')
}

export const updateAdminToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('adminToken', token)
}

export const setAdminAuth = (user: AdminUser, token: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('adminAuth', 'true')
  localStorage.setItem('adminEmail', user.email)
  localStorage.setItem('adminToken', token)
  localStorage.setItem('adminRefreshToken', refreshToken)
  localStorage.setItem('adminUser', JSON.stringify(user))
}

export const clearAdminAuth = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('adminAuth')
  localStorage.removeItem('adminEmail')
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminRefreshToken')
  localStorage.removeItem('adminUser')
}

export const verifyAdminToken = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false
  
  const token = getAdminToken()
  if (!token) return false

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agency-backend-pi.vercel.app/api/v1'

  try {
    const response = await fetch(`${API_BASE_URL}/admin/verify-token`, {
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

export const refreshAdminToken = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false
  
  const refreshToken = localStorage.getItem('adminRefreshToken')
  if (!refreshToken) return false

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agency-backend-pi.vercel.app/api/v1'

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    })

    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminRefreshToken', data.refreshToken)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Token refresh failed:', error)
    return false
  }
}
