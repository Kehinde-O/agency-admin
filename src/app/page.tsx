'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('kehindejohnomotoso+admin@gmail.com')
  const [password, setPassword] = useState('@@##Admin01')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Use local API route for admin login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
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
        
        // Add a small delay to ensure localStorage is set
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } else {
        // Always show generic error message for security
        setError('Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-600 rounded-2xl mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Sign in to access the Agency admin panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-500 focus:outline-none"
                  placeholder="Enter your admin email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-500 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm mb-4">
            © 2024 Agency Admin. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs">
            Having trouble? Try the{' '}
            <a 
              href="/force-login" 
              className="text-slate-600 hover:text-slate-800 underline"
            >
              Force Login
            </a>{' '}
            page.
          </p>
        </div>
      </div>
    </div>
  )
}