'use client'

import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Server,
  Database,
  HardDrive,
  Mail,
  Globe,
  Shield
} from 'lucide-react'
import { safeCapitalize } from '@/lib/error-handler'

interface SystemService {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime?: string
  responseTime?: string
  lastChecked?: string
  description?: string
}

interface SystemStatusProps {
  services?: SystemService[]
  showHeader?: boolean
  title?: string
}

const mockServices: SystemService[] = [
  {
    id: '1',
    name: 'API Server',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '45ms',
    lastChecked: '2 minutes ago',
    description: 'Main application server'
  },
  {
    id: '2',
    name: 'Database',
    status: 'operational',
    uptime: '99.8%',
    responseTime: '12ms',
    lastChecked: '1 minute ago',
    description: 'Primary database cluster'
  },
  {
    id: '3',
    name: 'File Storage',
    status: 'operational',
    uptime: '99.9%',
    responseTime: '23ms',
    lastChecked: '3 minutes ago',
    description: 'Cloud storage service'
  },
  {
    id: '4',
    name: 'Email Service',
    status: 'degraded',
    uptime: '95.2%',
    responseTime: '2.1s',
    lastChecked: '5 minutes ago',
    description: 'Email delivery service'
  },
  {
    id: '5',
    name: 'CDN',
    status: 'operational',
    uptime: '99.7%',
    responseTime: '8ms',
    lastChecked: '1 minute ago',
    description: 'Content delivery network'
  },
  {
    id: '6',
    name: 'Security',
    status: 'operational',
    uptime: '100%',
    responseTime: '1ms',
    lastChecked: '30 seconds ago',
    description: 'Security monitoring'
  }
]

export default function SystemStatus({ 
  services = mockServices,
  showHeader = true,
  title = 'System Status'
}: SystemStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return CheckCircle
      case 'degraded':
        return AlertTriangle
      case 'outage':
        return XCircle
      case 'maintenance':
        return Clock
      default:
        return CheckCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500 bg-green-50'
      case 'degraded':
        return 'text-yellow-500 bg-yellow-50'
      case 'outage':
        return 'text-red-500 bg-red-50'
      case 'maintenance':
        return 'text-blue-500 bg-blue-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getServiceIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'api server':
        return Server
      case 'database':
        return Database
      case 'file storage':
        return HardDrive
      case 'email service':
        return Mail
      case 'cdn':
        return Globe
      case 'security':
        return Shield
      default:
        return Server
    }
  }

  const getOverallStatus = () => {
    const operational = services.filter(s => s.status === 'operational').length
    const total = services.length
    
    if (operational === total) return 'operational'
    if (operational >= total * 0.8) return 'degraded'
    return 'outage'
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-gray-500 text-sm mt-1">System health monitoring</p>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(overallStatus)}`}>
                {safeCapitalize(overallStatus)}
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center space-x-1">
              <span>View Details</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {services.map((service) => {
          const StatusIcon = getStatusIcon(service.status)
          const ServiceIcon = getServiceIcon(service.name)
          const colorClass = getStatusColor(service.status)
          
          return (
            <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <ServiceIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {service.status}
                      </div>
                    </div>
                    
                    {service.description && (
                      <p className="text-sm text-gray-600">{service.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {service.uptime && (
                    <p className="text-sm font-bold text-gray-900">{service.uptime}</p>
                  )}
                  {service.responseTime && (
                    <p className="text-xs text-gray-500">{service.responseTime} avg</p>
                  )}
                  {service.lastChecked && (
                    <p className="text-xs text-gray-500">{service.lastChecked}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
