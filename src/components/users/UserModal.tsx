'use client'

import { useState } from 'react'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  UserCheck, 
  UserX, 
  Activity,
  Home,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { User as UserType } from '@/types'
import UserAvatar from './UserAvatar'

interface UserModalProps {
  user: UserType
  onClose: () => void
  onUserAction: (userId: string, action: string, data?: any) => void
  actionLoading: string | null
}

export default function UserModal({ user, onClose, onUserAction, actionLoading }: UserModalProps) {
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [statusReason, setStatusReason] = useState('')
  const [newStatus, setNewStatus] = useState(user.status)
  const [newRole, setNewRole] = useState(user.role)

  const handleStatusChange = () => {
    onUserAction(user.id, 'status', { 
      status: newStatus, 
      reason: statusReason 
    })
    setShowStatusModal(false)
    setStatusReason('')
  }

  const handleRoleChange = () => {
    onUserAction(user.id, 'role', { role: newRole })
    setShowRoleModal(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100'
      case 'INACTIVE':
        return 'text-yellow-600 bg-yellow-100'
      case 'SUSPENDED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'text-purple-600 bg-purple-100'
      case 'OWNER':
        return 'text-indigo-600 bg-indigo-100'
      case 'AGENT':
        return 'text-blue-600 bg-blue-100'
      case 'USER':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center">
              <UserAvatar 
                user={user} 
                size="lg" 
                showStatus={true}
                showRole={true}
                showBorder={true}
                className="mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </h2>
                <p className="text-slate-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">User Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-medium text-slate-900">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600">Phone</p>
                        <p className="font-medium text-slate-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Member Since</p>
                      <p className="font-medium text-slate-900">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Last Active</p>
                      <p className="font-medium text-slate-900">
                        {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600">Role</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    {user.role !== 'ADMIN' && user.role !== 'OWNER' && (
                      <button
                        onClick={() => setShowRoleModal(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCheck className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-sm text-slate-600">Status</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                    {user.role !== 'ADMIN' && user.role !== 'OWNER' && (
                      <button
                        onClick={() => setShowStatusModal(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  <div className="flex items-center">
                    {user.isEmailVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                    )}
                    <div>
                      <p className="text-sm text-slate-600">Email Verification</p>
                      <p className="font-medium text-slate-900">
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Activity */}
            {user.properties && user.properties.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Home className="w-5 h-5 text-slate-600 mr-2" />
                  Recent Properties ({user._count?.properties || 0})
                </h3>
                <div className="space-y-2">
                  {user.properties.slice(0, 3).map((property: any) => (
                    <div key={property.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{property.title}</p>
                        <p className="text-sm text-slate-600">
                          Created {formatDate(property.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Bookings */}
            {user.bookings && user.bookings.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 text-slate-600 mr-2" />
                  Recent Bookings ({user._count?.bookings || 0})
                </h3>
                <div className="space-y-2">
                  {user.bookings.slice(0, 3).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{booking.property?.title}</p>
                        <p className="text-sm text-slate-600">
                          Booked {formatDate(booking.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Change User Status</h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Enter reason for status change..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={actionLoading === user.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === user.id ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-slate-900">Change User Role</h3>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'USER' | 'AGENT' | 'ADMIN')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="AGENT">Agent</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleChange}
                  disabled={actionLoading === user.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === user.id ? 'Updating...' : 'Update Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
