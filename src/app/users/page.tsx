'use client'

import { useEffect, useState } from 'react'
import { usePageTitle } from '@/contexts/PageContext'
import { apiService } from '@/lib/api'
import UserStats from '@/components/users/UserStats'
import UserFilters from '@/components/users/UserFilters'
import UserTable from '@/components/users/UserTable'
import UserModal from '@/components/users/UserModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { User } from '@/types'

export default function UsersPage() {
  const { setPageTitle } = usePageTitle()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    isVerified: undefined as boolean | undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    setPageTitle('Users', 'Manage user accounts and permissions')
  }, [setPageTitle])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getUsers(pagination.page, pagination.limit, filters)
      
      if (response.success) {
        setUsers(response.data.users)
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }))
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, filters])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleUserAction = async (userId: string, action: string, data?: any) => {
    try {
      setActionLoading(userId)
      
      switch (action) {
        case 'view':
          const userResponse = await apiService.getUserById(userId)
          if (userResponse.success) {
            setSelectedUser(userResponse.data.user)
            setShowUserModal(true)
          }
          break
        case 'status':
          await apiService.updateUserStatus(userId, data.status, data.reason)
          await fetchUsers()
          break
        case 'role':
          await apiService.updateUserRole(userId, data.role)
          await fetchUsers()
          break
        case 'delete':
          await apiService.deleteUser(userId)
          await fetchUsers()
          break
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err)
      setError(err instanceof Error ? err.message : `Failed to ${action} user`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCloseModal = () => {
    setShowUserModal(false)
    setSelectedUser(null)
  }

  // Show loading spinner for initial page load
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner 
          message="Loading users..." 
          size="lg"
          className="text-center"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-8">
        {/* Stats */}
        <UserStats />

        {/* Filters */}
        <div className="mb-6">
          <UserFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50">
          <UserTable
            users={users}
            loading={loading}
            error={error}
            pagination={pagination}
            actionLoading={actionLoading}
            onUserAction={handleUserAction}
            onPageChange={handlePageChange}
            onRefresh={fetchUsers}
          />
        </div>

        {/* User Modal */}
        {showUserModal && selectedUser && (
          <UserModal
            user={selectedUser}
            onClose={handleCloseModal}
            onUserAction={handleUserAction}
            actionLoading={actionLoading}
          />
        )}
      </div>
    </div>
  )
}
