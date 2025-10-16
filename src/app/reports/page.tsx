'use client'

import { useEffect } from 'react'
import { usePageTitle } from '@/contexts/PageContext'

export default function ReportsPage() {
  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle('Reports', 'Analytics and reporting dashboard')
  }, [setPageTitle])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Reports & Analytics</h2>
          <p className="text-slate-600">Reporting and analytics features will be implemented here.</p>
        </div>
      </div>
    </div>
  )
}
