'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Home, 
  FileText, 
  Settings, 
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import ActivityFeed from '@/components/ActivityFeed'
import { usePageTitle } from '@/contexts/PageContext'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle('Dashboard', 'Agency overview and management')
  }, [setPageTitle])


  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Properties', value: '567', change: '+8%', icon: Home, color: 'text-green-500' },
    { label: 'Revenue', value: '$45,678', change: '+23%', icon: DollarSign, color: 'text-purple-500' },
    { label: 'Active Listings', value: '89', change: '+5%', icon: Activity, color: 'text-orange-500' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Total Users', 
                  value: '2,847', 
                  change: '+12.5%', 
                  icon: Users, 
                  color: 'text-slate-600',
                  bgColor: 'bg-slate-50',
                  borderColor: 'border-slate-200',
                  trend: 'up',
                  description: 'Active platform users'
                },
                { 
                  label: 'Active Properties', 
                  value: '1,234', 
                  change: '+8.2%', 
                  icon: Home, 
                  color: 'text-slate-600',
                  bgColor: 'bg-slate-50',
                  borderColor: 'border-slate-200',
                  trend: 'up',
                  description: 'Listed properties'
                },
                { 
                  label: 'Pending Reviews', 
                  value: '89', 
                  change: '-15.3%', 
                  icon: AlertCircle, 
                  color: 'text-slate-600',
                  bgColor: 'bg-slate-50',
                  borderColor: 'border-slate-200',
                  trend: 'down',
                  description: 'Awaiting approval'
                },
                { 
                  label: 'Monthly Revenue', 
                  value: '₦45.2M', 
                  change: '+23.1%', 
                  icon: DollarSign, 
                  color: 'text-slate-600',
                  bgColor: 'bg-slate-50',
                  borderColor: 'border-slate-200',
                  trend: 'up',
                  description: 'This month'
                }
              ].map((stat, index) => (
                <div key={index} className={`bg-white rounded-2xl p-6 shadow-sm border ${stat.borderColor} hover:shadow-lg transition-all duration-300 group`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">vs last month</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Property Analytics - Takes 2 columns on desktop */}
              <div className="xl:col-span-2 space-y-6">
                {/* Property Status Overview */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Property Analytics</h3>
                      <p className="text-slate-500 text-sm mt-1">Overview of property status and distribution</p>
                    </div>
                    <button className="text-slate-600 hover:text-slate-700 text-sm font-semibold flex items-center space-x-1 transition-colors">
                      <span>View Details</span>
                      <span>→</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Available', count: 856, color: 'bg-slate-500', bgColor: 'bg-slate-50', textColor: 'text-slate-700' },
                      { label: 'Rented', count: 234, color: 'bg-slate-500', bgColor: 'bg-slate-50', textColor: 'text-slate-700' },
                      { label: 'Sold', count: 89, color: 'bg-slate-500', bgColor: 'bg-slate-50', textColor: 'text-slate-700' },
                      { label: 'Pending', count: 55, color: 'bg-slate-500', bgColor: 'bg-slate-50', textColor: 'text-slate-700' }
                    ].map((item, index) => (
                      <div key={index} className={`${item.bgColor} rounded-2xl p-4 text-center`}>
                        <div className={`w-4 h-4 rounded-full ${item.color} mx-auto mb-3`}></div>
                        <p className="text-3xl font-bold text-slate-900">{item.count}</p>
                        <p className={`text-sm font-medium ${item.textColor}`}>{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Property Types Chart */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">Property Types Distribution</h4>
                    {[
                      { type: 'Apartments', count: 45, percentage: 45, color: 'bg-slate-500', bgColor: 'bg-slate-50' },
                      { type: 'Houses', count: 32, percentage: 32, color: 'bg-slate-500', bgColor: 'bg-slate-50' },
                      { type: 'Commercial', count: 15, percentage: 15, color: 'bg-slate-500', bgColor: 'bg-slate-50' },
                      { type: 'Land', count: 8, percentage: 8, color: 'bg-slate-500', bgColor: 'bg-slate-50' }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-900 font-medium">{item.type}</span>
                          <span className="text-slate-600 font-semibold">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">User Growth</h3>
                      <p className="text-slate-500 text-sm mt-1">Monthly user registration trends</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg font-medium">7D</button>
                      <button className="px-4 py-2 text-sm bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors">30D</button>
                      <button className="px-4 py-2 text-sm bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 transition-colors">90D</button>
                    </div>
                  </div>
                  
                  <div className="h-80 flex items-end justify-between space-x-1">
                    {[65, 78, 85, 92, 88, 95, 102, 98, 105, 112, 108, 120].map((height, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div 
                          className="w-full bg-gradient-to-t from-slate-500 to-slate-400 rounded-t-lg transition-all duration-300 group-hover:from-slate-600 group-hover:to-slate-500"
                          style={{ height: `${height}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2 font-medium">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 mt-6 font-medium">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - 1 column on desktop */}
              <div className="xl:col-span-1 space-y-6">
                {/* Today's Performance */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Today's Performance</h3>
                      <p className="text-slate-500 text-sm">Real-time metrics</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { 
                        label: 'New Users', 
                        value: '47', 
                        icon: Users, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        change: '+12%',
                        trend: 'up'
                      },
                      { 
                        label: 'Properties Listed', 
                        value: '23', 
                        icon: Home, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        change: '+8%',
                        trend: 'up'
                      },
                      { 
                        label: 'Messages Sent', 
                        value: '156', 
                        icon: Activity, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        change: '+23%',
                        trend: 'up'
                      },
                      { 
                        label: 'Revenue Today', 
                        value: '₦2.1M', 
                        icon: DollarSign, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        change: '+15%',
                        trend: 'up'
                      }
                    ].map((stat, index) => (
                      <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                              <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                      <p className="text-slate-500 text-sm">Common admin tasks</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { 
                        label: 'Review Properties', 
                        icon: Home, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        count: '89 pending'
                      },
                      { 
                        label: 'Manage Users', 
                        icon: Users, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        count: '2,847 total'
                      },
                      { 
                        label: 'View Reports', 
                        icon: FileText, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        count: '12 available'
                      },
                      { 
                        label: 'System Settings', 
                        icon: Settings, 
                        color: 'text-slate-600', 
                        bgColor: 'bg-slate-50',
                        count: 'Configure'
                      }
                    ].map((action, index) => (
                      <button key={index} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                            <action.icon className={`w-4 h-4 ${action.color}`} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-slate-900">{action.label}</p>
                            <p className="text-xs text-slate-500">{action.count}</p>
                          </div>
                        </div>
                        <div className="text-slate-400 group-hover:text-slate-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <ActivityFeed maxItems={4} />
              </div>
            </div>

          </div>
        )
      case 'users':
        return (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">User Management</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-text-secondary">User management features will be implemented here.</p>
            </div>
          </div>
        )
      case 'properties':
        return (
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-text-secondary">Property management features will be implemented here.</p>
            </div>
          </div>
        )
      case 'pending':
        return (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Pending Properties</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-text-secondary mb-4">Manage property approvals and reviews.</p>
              <button
                onClick={() => router.push('/pending-properties')}
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                View Pending Properties
              </button>
            </div>
          </div>
        )
      case 'reports':
        return (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Reports & Analytics</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-text-secondary">Reports and analytics will be implemented here.</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Settings</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-text-secondary">System settings will be implemented here.</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  )
}
