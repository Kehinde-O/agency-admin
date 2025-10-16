'use client'

import { 
  CheckCircle, 
  Users, 
  Home, 
  DollarSign, 
  MessageCircle,
  Calendar,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

interface ActivityItem {
  id: string
  action: string
  description: string
  user: string
  time: string
  type: 'approval' | 'user' | 'property' | 'payment' | 'message' | 'booking' | 'warning' | 'growth'
  priority?: 'high' | 'medium' | 'low'
}

interface ActivityFeedProps {
  items?: ActivityItem[]
  maxItems?: number
  showHeader?: boolean
  title?: string
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    action: 'Property approved',
    description: 'Luxury Apartment in Victoria Island',
    user: 'Admin User',
    time: '2 minutes ago',
    type: 'approval',
    priority: 'medium'
  },
  {
    id: '2',
    action: 'New user registered',
    description: 'Sarah Johnson joined the platform',
    user: 'System',
    time: '15 minutes ago',
    type: 'user',
    priority: 'low'
  },
  {
    id: '3',
    action: 'Property listed',
    description: 'Modern Villa in Lekki Phase 1',
    user: 'Mike Johnson',
    time: '1 hour ago',
    type: 'property',
    priority: 'medium'
  },
  {
    id: '4',
    action: 'Payment received',
    description: '₦450,000 from John Doe',
    user: 'Payment System',
    time: '2 hours ago',
    type: 'payment',
    priority: 'high'
  },
  {
    id: '5',
    action: 'New inquiry',
    description: 'Interest in 3-bedroom apartment',
    user: 'Jane Smith',
    time: '3 hours ago',
    type: 'message',
    priority: 'medium'
  },
  {
    id: '6',
    action: 'Booking scheduled',
    description: 'Property viewing appointment',
    user: 'David Wilson',
    time: '4 hours ago',
    type: 'booking',
    priority: 'medium'
  },
  {
    id: '7',
    action: 'System alert',
    description: 'High server load detected',
    user: 'System Monitor',
    time: '5 hours ago',
    type: 'warning',
    priority: 'high'
  },
  {
    id: '8',
    action: 'Growth milestone',
    description: 'Reached 1000+ active users',
    user: 'Analytics',
    time: '6 hours ago',
    type: 'growth',
    priority: 'low'
  }
]

export default function ActivityFeed({ 
  items = mockActivities, 
  maxItems = 8,
  showHeader = true,
  title = 'Recent Activity'
}: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return CheckCircle
      case 'user':
        return Users
      case 'property':
        return Home
      case 'payment':
        return DollarSign
      case 'message':
        return MessageCircle
      case 'booking':
        return Calendar
      case 'warning':
        return AlertTriangle
      case 'growth':
        return TrendingUp
      default:
        return CheckCircle
    }
  }

  const getActivityColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'text-red-500 bg-red-50'
    if (priority === 'medium') return 'text-yellow-500 bg-yellow-50'
    if (priority === 'low') return 'text-green-500 bg-green-50'
    
    switch (type) {
      case 'approval':
        return 'text-green-500 bg-green-50'
      case 'user':
        return 'text-blue-500 bg-blue-50'
      case 'property':
        return 'text-purple-500 bg-purple-50'
      case 'payment':
        return 'text-orange-500 bg-orange-50'
      case 'message':
        return 'text-indigo-500 bg-indigo-50'
      case 'booking':
        return 'text-cyan-500 bg-cyan-50'
      case 'warning':
        return 'text-red-500 bg-red-50'
      case 'growth':
        return 'text-emerald-500 bg-emerald-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null
    
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority}
      </span>
    )
  }

  const displayItems = items.slice(0, maxItems)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-gray-500 text-sm mt-1">Real-time activity updates</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center space-x-1">
              <span>View All</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {displayItems.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-text-secondary">No recent activity</p>
          </div>
        ) : (
          displayItems.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const colorClass = getActivityColor(activity.type, activity.priority)
            
            return (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      {getPriorityBadge(activity.priority)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
