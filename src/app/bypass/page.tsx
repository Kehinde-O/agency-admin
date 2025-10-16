'use client'

import { useEffect } from 'react'

export default function Bypass() {
  useEffect(() => {
    // Clear all authentication data
    localStorage.clear()
    sessionStorage.clear()
    
    // Force redirect to login page
    window.location.href = '/'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Clearing authentication and redirecting to login...</p>
      </div>
    </div>
  )
}
