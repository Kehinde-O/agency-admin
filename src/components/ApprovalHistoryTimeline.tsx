'use client'

import { CheckCircle, XCircle, AlertTriangle, RotateCcw, Clock, User } from 'lucide-react'
import { Property } from '@/types'

interface ApprovalHistoryTimelineProps {
  property: Property
}

export default function ApprovalHistoryTimeline({ property }: ApprovalHistoryTimelineProps) {
  const approvalHistory = property.approvalHistory || []

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'pulled_down':
      case 'pulled down':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'reactivated':
        return <RotateCcw className="w-5 h-5 text-blue-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'approved':
        return 'bg-green-50 border-green-200'
      case 'rejected':
        return 'bg-red-50 border-red-200'
      case 'pulled_down':
      case 'pulled down':
        return 'bg-orange-50 border-orange-200'
      case 'reactivated':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-700 bg-green-100'
      case 'REJECTED':
        return 'text-red-700 bg-red-100'
      case 'INACTIVE':
        return 'text-orange-700 bg-orange-100'
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  if (approvalHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Approval History</h3>
              <p className="text-sm text-slate-600">Property approval and status changes</p>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">No History Yet</h4>
            <p className="text-slate-600">This property hasn't been through any approval processes.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mr-4">
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Approval History</h3>
            <p className="text-sm text-slate-600">{approvalHistory.length} action{approvalHistory.length !== 1 ? 's' : ''} recorded</p>
          </div>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-6">
            {approvalHistory.map((entry, index) => (
              <div key={entry.id || index} className="relative flex items-start space-x-4">
                {/* Timeline Dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-2 ${getActionColor(entry.action)} flex items-center justify-center`}>
                  {getActionIcon(entry.action)}
                </div>

                {/* Timeline Content */}
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-50 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 capitalize">
                          {entry.action.replace('_', ' ')}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(entry.previousStatus)}`}>
                            {entry.previousStatus}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(entry.newStatus)}`}>
                            {entry.newStatus}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(entry.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {/* Admin Info */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {entry.admin.firstName} {entry.admin.lastName}
                        </div>
                        <div className="text-xs text-slate-500">{entry.admin.email}</div>
                      </div>
                    </div>

                    {/* Reason */}
                    {entry.reason && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                        <div className="text-sm font-medium text-slate-600 mb-1">Reason</div>
                        <p className="text-slate-700 text-sm">{entry.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
