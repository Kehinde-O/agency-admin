'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForceLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Clear any existing authentication
    localStorage.clear()
    console.log('Cleared localStorage')
  }, [])

  const handleForceLogin = async () => {
    setIsLoading(true)
    setMessage('Logging in...')

    try {
      // Call the login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'kehindejohnomotoso+admin@gmail.com',
          password: '@@##Admin01'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store admin session with token
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminEmail', data.data.user.email)
        localStorage.setItem('adminToken', data.data.token)
        localStorage.setItem('adminRefreshToken', data.data.refreshToken)
        localStorage.setItem('adminUser', JSON.stringify(data.data.user))
        
        console.log('Login successful, stored auth data:', {
          adminAuth: localStorage.getItem('adminAuth'),
          hasToken: !!localStorage.getItem('adminToken'),
          hasUser: !!localStorage.getItem('adminUser')
        })
        
        setMessage('Login successful! Redirecting to dashboard...')
        
        // Add a delay to ensure localStorage is set
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        setMessage('Login failed: ' + data.message)
      }
    } catch (error) {
      setMessage('Login error: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAuth = () => {
    localStorage.clear()
    setMessage('Authentication cleared. You can now try logging in again.')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Force Login</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
          <p className="text-slate-600">
            This page will clear all authentication and force a fresh login.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleForceLogin}
              disabled={isLoading}
              className="w-full bg-slate-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? 'Logging in...' : 'Force Login as Admin'}
            </button>
            
            <button
              onClick={handleClearAuth}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Clear Authentication
            </button>
          </div>
          
          {message && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <p className="text-slate-700">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
