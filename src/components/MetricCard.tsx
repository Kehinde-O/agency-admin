import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: string
  bgColor?: string
  description?: string
}

export default function MetricCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'text-primary-500',
  bgColor = 'bg-primary-50',
  description
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return ''
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {change && (
          <div className="text-right">
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()} {change}
            </span>
            <p className="text-xs text-text-secondary">vs last period</p>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        <p className="text-text-secondary text-sm">{title}</p>
      </div>
      
      {description && (
        <p className="text-xs text-text-light">{description}</p>
      )}
    </div>
  )
}
