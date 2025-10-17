'use client'

export default function TestLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9fcfd' }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Page Test</h1>
        <p className="text-gray-600 mb-4">This page is accessible without authentication</p>
        <a 
          href="/" 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login Page
        </a>
      </div>
    </div>
  )
}
