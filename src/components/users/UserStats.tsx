'use client'

import { useEffect, useState } from 'react'
import { apiService } from '@/lib/api'
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Activity,
  Shield,
  UserX
} from 'lucide-react'

interface UserStatsData {
  totalUsers: number
  usersByRole: Record<string, number>
  usersByStatus: Record<string, number>
  verifiedUsers: number
  newUsersThisMonth: number
  activeUsers: number
}

export default function UserStats() {
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await apiService.getUserStats()
        if (response.success) {
          setStats(response.data)
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: null
    },
    {
      title: 'Verified Users',
      value: stats.verifiedUsers.toLocaleString(),
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: null
    },
    {
      title: 'New This Month',
      value: stats.newUsersThisMonth.toLocaleString(),
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: null
    }
  ]

  return (
    <div className="mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role and Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 text-slate-600 mr-2" />
            Users by Role
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.usersByRole).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 capitalize">
                  {role.toLowerCase()}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Users by Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <UserX className="w-5 h-5 text-slate-600 mr-2" />
            Users by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.usersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 capitalize">
                  {status.toLowerCase()}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
