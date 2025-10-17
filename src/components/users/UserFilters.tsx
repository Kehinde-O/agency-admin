'use client'

import { useState } from 'react'
import { Search, Filter, X, RotateCcw } from 'lucide-react'

interface UserFiltersProps {
  filters: {
    search: string
    role: string
    status: string
    isVerified: boolean | undefined
    sortBy: string
    sortOrder: string
  }
  onFilterChange: (newFilters: Partial<UserFiltersProps['filters']>) => void
}

export default function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearchChange = (value: string) => {
    onFilterChange({ search: value })
  }

  const handleRoleChange = (value: string) => {
    onFilterChange({ role: value })
  }

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value })
  }

  const handleVerificationChange = (value: string) => {
    const isVerified = value === 'all' ? undefined : value === 'verified'
    onFilterChange({ isVerified })
  }

  const handleSortChange = (value: string) => {
    onFilterChange({ sortBy: value })
  }

  const handleSortOrderChange = (value: string) => {
    onFilterChange({ sortOrder: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: '',
      role: '',
      status: '',
      isVerified: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
  }

  const hasActiveFilters = 
    filters.search || 
    filters.role || 
    filters.status || 
    filters.isVerified !== undefined ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc'

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <Filter className="w-5 h-5 text-slate-600 mr-2" />
          Filters & Search
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {showAdvanced ? <X className="w-4 h-4 mr-1" /> : <Filter className="w-4 h-4 mr-1" />}
            {showAdvanced ? 'Hide' : 'Advanced'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="AGENT">Agent</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Verification
            </label>
            <select
              value={filters.isVerified === undefined ? 'all' : filters.isVerified ? 'verified' : 'unverified'}
              onChange={(e) => handleVerificationChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="lastActive">Last Active</option>
            </select>
          </div>
        </div>
      )}

      {/* Sort Order */}
      {showAdvanced && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sort Order
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="sortOrder"
                value="desc"
                checked={filters.sortOrder === 'desc'}
                onChange={(e) => handleSortOrderChange(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Descending</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sortOrder"
                value="asc"
                checked={filters.sortOrder === 'asc'}
                onChange={(e) => handleSortOrderChange(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-slate-700">Ascending</span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {filters.search}
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.role && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Role: {filters.role}
                <button
                  onClick={() => handleRoleChange('')}
                  className="ml-1 hover:text-green-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Status: {filters.status}
                <button
                  onClick={() => handleStatusChange('')}
                  className="ml-1 hover:text-yellow-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isVerified !== undefined && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Verification: {filters.isVerified ? 'Verified' : 'Unverified'}
                <button
                  onClick={() => handleVerificationChange('all')}
                  className="ml-1 hover:text-purple-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
