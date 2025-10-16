'use client'

import { useEffect, useState } from 'react'
import { checkAdminAuth, getAdminUser } from '@/lib/auth'

export default function TestAuth() {
  const [authStatus, setAuthStatus] = useState<any>(null)

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return
      
      const auth = checkAdminAuth()
      const user = getAdminUser()
      const adminAuth = localStorage.getItem('adminAuth')
      const adminToken = localStorage.getItem('adminToken')
      const adminUser = localStorage.getItem('adminUser')
      
      setAuthStatus({
        auth,
        user: !!user,
        adminAuth,
        hasToken: !!adminToken,
        hasUser: !!adminUser,
        allKeys: Object.keys(localStorage)
      })
    }

    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Authentication Test</h1>
        
        {authStatus ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>checkAdminAuth():</strong> {authStatus.auth ? 'true' : 'false'}</p>
              <p><strong>getAdminUser():</strong> {authStatus.user ? 'Present' : 'Missing'}</p>
              <p><strong>adminAuth:</strong> {authStatus.adminAuth || 'Missing'}</p>
              <p><strong>adminToken:</strong> {authStatus.hasToken ? 'Present' : 'Missing'}</p>
              <p><strong>adminUser:</strong> {authStatus.hasUser ? 'Present' : 'Missing'}</p>
              <p><strong>All localStorage keys:</strong> {authStatus.allKeys.join(', ')}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <p>Loading authentication status...</p>
          </div>
        )}
      </div>
    </div>
  )
}
