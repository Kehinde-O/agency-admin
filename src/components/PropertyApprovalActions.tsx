'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, Settings, Edit, ExternalLink, Trash2, Download, MessageSquare, Eye, Loader2 } from 'lucide-react'
import { Property } from '@/types'

interface PropertyApprovalActionsProps {
  property: Property
  onApprove: (reason?: string) => void
  onReject: (reason: string) => void
  onPullDown: (reason: string) => void
  onReactivate: (reason?: string) => void
  onEdit: () => void
  onContact: () => void
  onViewMobile: () => void
  onDelete: () => void
  onExport: () => void
  isProcessing: boolean
}

export default function PropertyApprovalActions({
  property,
  onApprove,
  onReject,
  onPullDown,
  onReactivate,
  onEdit,
  onContact,
  onViewMobile,
  onDelete,
  onExport,
  isProcessing
}: PropertyApprovalActionsProps) {
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [showPullDownModal, setShowPullDownModal] = useState(false)
  const [showReactivateModal, setShowReactivateModal] = useState(false)
  const [approvalReason, setApprovalReason] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [pullDownReason, setPullDownReason] = useState('')
  const [reactivateReason, setReactivateReason] = useState('')

  const handleApprove = () => {
    onApprove(approvalReason)
    setShowApprovalModal(false)
    setApprovalReason('')
  }

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason)
      setShowRejectionModal(false)
      setRejectionReason('')
    }
  }

  const handlePullDown = () => {
    if (pullDownReason.trim()) {
      onPullDown(pullDownReason)
      setShowPullDownModal(false)
      setPullDownReason('')
    }
  }

  const handleReactivate = () => {
    onReactivate(reactivateReason)
    setShowReactivateModal(false)
    setReactivateReason('')
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'DRAFT':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Determine available actions based on property status
  const getAvailableActions = () => {
    const status = property.status?.toUpperCase()
    
    switch (status) {
      case 'PENDING':
        return {
          canApprove: true,
          canReject: true,
          canPullDown: false,
          canReactivate: false
        }
      case 'ACTIVE':
        return {
          canApprove: false,
          canReject: false,
          canPullDown: true,
          canReactivate: false
        }
      case 'INACTIVE':
        return {
          canApprove: false,
          canReject: false,
          canPullDown: false,
          canReactivate: true
        }
      case 'REJECTED':
        return {
          canApprove: true,
          canReject: false,
          canPullDown: false,
          canReactivate: false
        }
      case 'DRAFT':
        return {
          canApprove: true,
          canReject: true,
          canPullDown: false,
          canReactivate: false
        }
      default:
        return {
          canApprove: false,
          canReject: false,
          canPullDown: false,
          canReactivate: false
        }
    }
  }

  const availableActions = getAvailableActions()

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Admin Actions</h3>
              <p className="text-sm text-gray-600">Manage property status and perform administrative tasks</p>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Current Status</h4>
                <p className="text-xs text-gray-600">Property listing status</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(property.status)}`}>
                {property.status}
              </span>
            </div>
          </div>

          {/* Primary Actions - Status-based */}
          <div className="space-y-3 mb-6">
            {availableActions.canApprove && (
              <button
                onClick={() => setShowApprovalModal(true)}
                disabled={isProcessing}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition-colors border border-green-200 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Approve Property'}</span>
              </button>
            )}

            {availableActions.canReject && (
              <button
                onClick={() => setShowRejectionModal(true)}
                disabled={isProcessing}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-700 font-medium rounded-xl hover:bg-red-100 transition-colors border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Reject Property'}</span>
              </button>
            )}

            {availableActions.canPullDown && (
              <button
                onClick={() => setShowPullDownModal(true)}
                disabled={isProcessing}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-orange-50 text-orange-700 font-medium rounded-xl hover:bg-orange-100 transition-colors border border-orange-200 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Pull Down Property'}</span>
              </button>
            )}

            {availableActions.canReactivate && (
              <button
                onClick={() => setShowReactivateModal(true)}
                disabled={isProcessing}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 text-purple-700 font-medium rounded-xl hover:bg-purple-100 transition-colors border border-purple-200 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RotateCcw className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Reactivate Property'}</span>
              </button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="space-y-2">
            <button
              onClick={onEdit}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={onContact}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact Owner</span>
            </button>

            <button
              onClick={onViewMobile}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Eye className="w-5 h-5" />
              <span>View on Mobile</span>
            </button>

            <button
              onClick={onExport}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export Data</span>
            </button>

            <button
              onClick={onDelete}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Property</span>
            </button>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-md mx-4 shadow-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Approve Property</h3>
                <p className="text-sm text-gray-600">Add approval notes (optional)</p>
              </div>
            </div>
            <textarea
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder="Add approval notes (optional)..."
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isProcessing ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-md mx-4 shadow-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-3">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reject Property</h3>
                <p className="text-sm text-gray-600">Please provide a reason for rejection</p>
              </div>
            </div>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              rows={3}
              required
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isProcessing ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pull Down Modal */}
      {showPullDownModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-md mx-4 shadow-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Pull Down Property</h3>
                <p className="text-sm text-gray-600">Please provide a reason for pulling down</p>
              </div>
            </div>
            <textarea
              value={pullDownReason}
              onChange={(e) => setPullDownReason(e.target.value)}
              placeholder="Please provide a reason for pulling down..."
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              rows={3}
              required
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPullDownModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePullDown}
                disabled={isProcessing || !pullDownReason.trim()}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isProcessing ? 'Pulling Down...' : 'Pull Down'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-md mx-4 shadow-xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                <RotateCcw className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reactivate Property</h3>
                <p className="text-sm text-gray-600">Add reactivation notes (optional)</p>
              </div>
            </div>
            <textarea
              value={reactivateReason}
              onChange={(e) => setReactivateReason(e.target.value)}
              placeholder="Add reactivation notes (optional)..."
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReactivateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReactivate}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isProcessing ? 'Reactivating...' : 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
