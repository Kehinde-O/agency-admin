'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, Settings, Flag, Edit, ExternalLink, Trash2, Download } from 'lucide-react'
import { Property } from '@/types'

interface PropertyApprovalActionsProps {
  property: Property
  onApprove: (reason?: string) => void
  onReject: (reason: string) => void
  onPullDown: (reason: string) => void
  onReactivate: (reason?: string) => void
  onEdit: () => void
  onFlag: () => void
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
  onFlag,
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
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'DRAFT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mr-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Admin Actions</h3>
              <p className="text-sm text-slate-600">Manage property status and perform administrative tasks</p>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Current Status</h4>
                <p className="text-sm text-slate-600">Property listing status</p>
              </div>
              <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(property.status)}`}>
                {property.status}
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {property.approvalStatus?.canApprove && (
              <button
                onClick={() => setShowApprovalModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve Property
              </button>
            )}

            {property.approvalStatus?.canReject && (
              <button
                onClick={() => setShowRejectionModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject Property
              </button>
            )}

            {property.approvalStatus?.canPullDown && (
              <button
                onClick={() => setShowPullDownModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Pull Down Property
              </button>
            )}

            {property.approvalStatus?.canReactivate && (
              <button
                onClick={() => setShowReactivateModal(true)}
                disabled={isProcessing}
                className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reactivate Property
              </button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={onEdit}
              className="flex items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 hover:border-slate-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </button>

            <button
              onClick={onFlag}
              className="flex items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 hover:border-slate-300"
            >
              <Flag className="w-4 h-4 mr-2" />
              Flag for Review
            </button>

            <button
              onClick={onContact}
              className="flex items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 hover:border-slate-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Contact Owner
            </button>

            <button
              onClick={onViewMobile}
              className="flex items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 hover:border-slate-300"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Mobile
            </button>

            <button
              onClick={onExport}
              className="flex items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200 hover:border-slate-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>

            <button
              onClick={onDelete}
              className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 font-medium rounded-xl hover:bg-red-100 transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Property
            </button>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 max-w-md mx-4 shadow-2xl border border-slate-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Approve Property</h3>
                <p className="text-sm text-slate-600">Add approval notes (optional)</p>
              </div>
            </div>
            <textarea
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder="Add approval notes (optional)..."
              className="w-full p-4 border border-slate-200 rounded-xl mb-6 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                {isProcessing ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 max-w-md mx-4 shadow-2xl border border-slate-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Reject Property</h3>
                <p className="text-sm text-slate-600">Please provide a reason for rejection</p>
              </div>
            </div>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-4 border border-slate-200 rounded-xl mb-6 resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              rows={3}
              required
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                {isProcessing ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pull Down Modal */}
      {showPullDownModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 max-w-md mx-4 shadow-2xl border border-slate-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Pull Down Property</h3>
                <p className="text-sm text-slate-600">Please provide a reason for pulling down</p>
              </div>
            </div>
            <textarea
              value={pullDownReason}
              onChange={(e) => setPullDownReason(e.target.value)}
              placeholder="Please provide a reason for pulling down..."
              className="w-full p-4 border border-slate-200 rounded-xl mb-6 resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              rows={3}
              required
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPullDownModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePullDown}
                disabled={isProcessing || !pullDownReason.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                {isProcessing ? 'Pulling Down...' : 'Pull Down'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Modal */}
      {showReactivateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 max-w-md mx-4 shadow-2xl border border-slate-200/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Reactivate Property</h3>
                <p className="text-sm text-slate-600">Add reactivation notes (optional)</p>
              </div>
            </div>
            <textarea
              value={reactivateReason}
              onChange={(e) => setReactivateReason(e.target.value)}
              placeholder="Add reactivation notes (optional)..."
              className="w-full p-4 border border-slate-200 rounded-xl mb-6 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReactivateModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReactivate}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
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
