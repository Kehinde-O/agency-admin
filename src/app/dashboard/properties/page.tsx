'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import { 
  Eye, 
  Clock, 
  MapPin, 
  Search,
  RefreshCw,
  AlertCircle,
  Grid3X3,
  List,
  TrendingUp,
  Calendar,
  Home,
  Building,
  LandPlot,
  Briefcase,
  CheckCircle2
} from 'lucide-react'
import { Property } from '@/types'
import { apiService } from '@/lib/api'
import { safeCapitalize, safeUserDisplayName, safeUserInitials, sanitizeProperty } from '@/lib/error-handler'
import { usePageTitle } from '@/contexts/PageContext'

export default function AllPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle('All Properties', 'Manage all property listings')
  }, [setPageTitle])

  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const router = useRouter()

  // Load all properties from API
  const loadAllProperties = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiService.getAllProperties(
        pagination.page,
        pagination.limit,
        filterStatus === 'all' ? undefined : filterStatus,
        filterType === 'all' ? undefined : filterType
      )
      
      if (response.success) {
        setProperties(response.data.properties)
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }))
      } else {
        setError(response.message || 'Failed to load properties')
      }
    } catch (error) {
      console.error('Error loading properties:', error)
      setError('Failed to load properties. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page, pagination.limit, filterStatus, filterType])

  useEffect(() => {
    loadAllProperties()
  }, [loadAllProperties])

  useEffect(() => {
    // Filter properties based on search term and type
    let filtered = properties

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.location && property.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (property.user?.firstName && property.user?.lastName && `${property.user.firstName} ${property.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (property.city && property.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (property.state && property.state.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(property => property.type === filterType)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(property => property.status === filterStatus)
    }

    // Sort properties
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'price':
          aValue = a.price || 0
          bValue = b.price || 0
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredProperties(filtered)
  }, [properties, searchTerm, filterType, filterStatus, sortBy, sortOrder])

  const handleViewProperty = (propertyId: string) => {
    router.push(`/dashboard/properties/${propertyId}`)
  }

  const formatPrice = (price: number, currency = 'NGN') =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return <Building className="w-4 h-4" />
      case 'house':
        return <Home className="w-4 h-4" />
      case 'land':
        return <LandPlot className="w-4 h-4" />
      case 'commercial':
        return <Briefcase className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Properties</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={loadAllProperties}
            className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search properties, locations, owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-300 transition-all duration-200"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="title-asc">Title: A to Z</option>
                <option value="title-desc">Title: Z to A</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-slate-50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-slate-900' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {filteredProperties.length} Propert{filteredProperties.length !== 1 ? 'ies' : 'y'}
            </h2>
            {searchTerm && (
              <span className="text-slate-600">
                matching "{searchTerm}"
              </span>
            )}
          </div>
          <button
            onClick={loadAllProperties}
            className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Properties Found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm 
                ? `No properties match your search for "${searchTerm}". Try adjusting your filters.`
                : 'No properties are available at the moment.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => handleViewProperty(property.id)}
              >
                {/* Property Image */}
                <div className={`relative ${
                  viewMode === 'list' ? 'w-64 h-48' : 'h-48'
                }`}>
                  {property.featuredImage ? (
                    <img
                      src={property.featuredImage}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="w-full h-full" />
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                      {getTypeIcon(property.type)}
                      <span className="text-xs font-medium text-slate-700">
                        {safeCapitalize(property.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-slate-900">
                        {formatPrice(property.price, property.currency)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm truncate">
                      {property.location || 'Location not specified'}
                    </span>
                  </div>

                  {/* Property Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-4">
                      {property.bedrooms && (
                        <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                      )}
                      {property.bathrooms && (
                        <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                      )}
                      {property.area && (
                        <span>{property.area} sq ft</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Owner Info */}
                  {property.user && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {safeUserInitials(property.user)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {safeUserDisplayName(property.user)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {property.user.role === 'agent' ? 'Agent' : 'Owner'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewProperty(property.id)
                        }}
                        className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        pagination.page === page
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
