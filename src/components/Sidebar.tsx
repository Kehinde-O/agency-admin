'use client'

import { LucideIcon, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { clearAdminAuth } from '@/lib/auth'

interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  items: SidebarItem[]
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ 
  items, 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose 
}: SidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    clearAdminAuth()
    router.push('/')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-text-primary">Agency Admin</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id)
                onClose()
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}
