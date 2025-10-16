'use client'

import { useEffect, useState } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar,
  Filter,
  Download,
  Trash2
} from 'lucide-react'
import { safeCapitalize, sanitizeLog } from '@/lib/error-handler'
import { ApprovalLog, approvalLogger } from '@/lib/approval-logger'

interface ApprovalLogsProps {
  propertyId?: string
  adminEmail?: string
  showActions?: boolean
}

export default function ApprovalLogs({ 
  propertyId, 
  adminEmail, 
  showActions = true 
}: ApprovalLogsProps) {
  const [logs, setLogs] = useState<ApprovalLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    loadLogs()
  }, [propertyId, adminEmail])

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      let fetchedLogs: ApprovalLog[]
      
      if (propertyId) {
        fetchedLogs = approvalLogger.getPropertyHistory(propertyId)
      } else if (adminEmail) {
        fetchedLogs = approvalLogger.getAdminActivity(adminEmail)
      } else {
        fetchedLogs = approvalLogger.getLogs()
      }

      setLogs(fetchedLogs)
    } catch (error) {
      console.error('Failed to load approval logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true
    return log.action === filter
  })

  const handleDeleteLog = async (logId: string) => {
    if (confirm('Are you sure you want to delete this log entry?')) {
      try {
        // In a real app, you would call the API
        console.log('Deleting log:', logId)
        await loadLogs() // Reload logs
      } catch (error) {
        console.error('Failed to delete log:', error)
      }
    }
  }

  const handleExportLogs = () => {
    const dataStr = approvalLogger.exportLogs()
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `approval-logs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-200'
      default:
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Approval Logs</h3>
            <p className="text-sm text-text-secondary">
              {filteredLogs.length} log entries found
            </p>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportLogs}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-text-secondary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="divide-y divide-gray-200">
        {filteredLogs.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-text-secondary">No approval logs found</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {safeCapitalize(log.action)}
                      </span>
                      <span className="text-sm text-text-secondary">
                        Property ID: {log.propertyId}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-text-secondary mb-2">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{log.adminName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {log.reason && (
                      <p className="text-sm text-text-secondary bg-gray-50 p-2 rounded-lg">
                        <strong>Reason:</strong> {log.reason}
                      </p>
                    )}
                    
                    {log.metadata && (
                      <div className="mt-2 text-xs text-text-secondary">
                        <p><strong>Property:</strong> {log.metadata.propertyTitle}</p>
                        <p><strong>Owner:</strong> {log.metadata.ownerName}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {showActions && (
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
