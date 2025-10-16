'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ManualLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleManualLogin = async () => {
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
        
        setMessage('Login successful! Redirecting to dashboard...')
        
        // Add a delay to ensure localStorage is set
        setTimeout(() => {
          router.push('/dashboard')
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

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Manual Login Test</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-4">
            This page will manually log you in with the admin credentials.
          </p>
          
          <button
            onClick={handleManualLogin}
            disabled={isLoading}
            className="w-full bg-slate-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
          
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
