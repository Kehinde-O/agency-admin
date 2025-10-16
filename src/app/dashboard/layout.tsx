'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Users, 
  Home, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  AlertCircle
} from 'lucide-react'
import { checkAdminAuth, getAdminUser, clearAdminAuth } from '@/lib/auth'
import { safeCharAt } from '@/lib/error-handler'
import { PageProvider, usePageTitle } from '@/contexts/PageContext'
import AuthGuard from '@/components/AuthGuard'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { title, subtitle } = usePageTitle()

  useEffect(() => {
    // Get admin user from localStorage
    const user = getAdminUser()
    if (user) {
      setAdminUser(user)
    }
  }, [])

  // Add a check to handle token expiration
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminToken' && !e.newValue) {
        // Token was removed, redirect to login
        clearAdminAuth()
        router.push('/')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [router])

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage
      clearAdminAuth()
      router.push('/')
    }
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/users' },
    { id: 'properties', label: 'All Properties', icon: Home, path: '/properties' },
    { id: 'pending', label: 'Pending Review', icon: AlertCircle, path: '/pending-properties' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ]

  const getActiveTab = () => {
    if (pathname === '/dashboard') return 'overview'
    if (pathname.startsWith('/properties')) return 'properties'
    if (pathname.startsWith('/pending-properties')) return 'pending'
    if (pathname.startsWith('/users')) return 'users'
    if (pathname.startsWith('/reports')) return 'reports'
    if (pathname.startsWith('/settings')) return 'settings'
    return 'overview'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-slate-200/60 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-8 border-b border-slate-200/60">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Agency Admin</h1>
              <p className="text-xs text-slate-500">Property Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                router.push(item.path)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl mb-3 transition-all duration-200 group ${
                getActiveTab() === item.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${getActiveTab() === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-4 py-4 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-500" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Dynamic Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30">
          <div className="px-8 h-20 flex items-center justify-between">
            {/* Left Section - Title and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>
              
              {/* Page Title */}
              {(title || subtitle) && (
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-slate-600 font-medium">{subtitle}</p>
                  )}
                </div>
              )}
            </div>

            {/* Right Section - User Profile Only */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {safeCharAt(adminUser?.firstName) || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-slate-900 truncate max-w-32" title={`${adminUser?.firstName || 'Admin'} ${adminUser?.lastName || ''}`.trim()}>
                    {`${adminUser?.firstName || 'Admin'} ${adminUser?.lastName || ''}`.trim()}
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-32" title="Administrator">
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <PageProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PageProvider>
  )
}
