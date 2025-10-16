import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  change?: string
  icon: LucideIcon
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatsCard({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color = 'text-primary-500',
  trend = 'neutral'
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gray-50`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {change && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-1">{value}</h3>
      <p className="text-text-secondary text-sm">{label}</p>
    </div>
  )
}
