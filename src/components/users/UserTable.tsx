'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  UserCheck, 
  UserX, 
  Shield, 
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import { User } from '@/types'
import UserAvatar from './UserAvatar'

interface UserTableProps {
  users: User[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  actionLoading: string | null
  onUserAction: (userId: string, action: string, data?: any) => void
  onPageChange: (page: number) => void
  onRefresh: () => void
}

export default function UserTable({ 
  users, 
  loading, 
  error, 
  pagination, 
  actionLoading, 
  onUserAction, 
  onPageChange, 
  onRefresh 
}: UserTableProps) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'OWNER':
        return 'bg-indigo-100 text-indigo-800'
      case 'AGENT':
        return 'bg-blue-100 text-blue-800'
      case 'USER':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStatusChange = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    onUserAction(userId, 'status', { status: newStatus })
  }

  const handleRoleChange = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'USER' ? 'AGENT' : 'USER'
    onUserAction(userId, 'role', { role: newRole })
  }

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      onUserAction(userId, 'delete')
    }
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Users</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-600">
            {pagination.total.toLocaleString()} total users
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Verified</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Created</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-700">Last Active</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="text-slate-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  {/* User Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <UserAvatar 
                        user={user} 
                        size="md" 
                        showStatus={true}
                        showRole={true}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-slate-900">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.email
                          }
                        </div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-sm text-slate-500">{user.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>

                  {/* Verified */}
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {user.isEmailVerified ? (
                        <UserCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <UserX className="w-4 h-4 text-red-600" />
                      )}
                      <span className="ml-2 text-sm text-slate-600">
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Last Active */}
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end">
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                          ) : (
                            <MoreHorizontal className="w-4 h-4 text-slate-600" />
                          )}
                        </button>

                        {dropdownOpen === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  router.push(`/users/${user.id}`)
                                  setDropdownOpen(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              >
                                <Eye className="w-4 h-4 mr-3" />
                                View Details
                              </button>
                              
                              <button
                                onClick={() => {
                                  handleStatusChange(user.id, user.status)
                                  setDropdownOpen(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                disabled={user.role === 'ADMIN' || user.role === 'OWNER'}
                              >
                                {user.status === 'ACTIVE' ? (
                                  <UserX className="w-4 h-4 mr-3" />
                                ) : (
                                  <UserCheck className="w-4 h-4 mr-3" />
                                )}
                                {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                              </button>

                              <button
                                onClick={() => {
                                  handleRoleChange(user.id, user.role)
                                  setDropdownOpen(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                disabled={user.role === 'ADMIN' || user.role === 'OWNER'}
                              >
                                <Shield className="w-4 h-4 mr-3" />
                                {user.role === 'USER' ? 'Make Agent' : 'Make User'}
                              </button>

                              <div className="border-t border-slate-200 my-1"></div>

                              <button
                                onClick={() => {
                                  handleDelete(user.id)
                                  setDropdownOpen(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                disabled={user.role === 'ADMIN' || user.role === 'OWNER'}
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
