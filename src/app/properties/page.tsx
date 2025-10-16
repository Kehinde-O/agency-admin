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
      
      // Check if we have authentication token
      const token = localStorage.getItem('adminToken')
      if (!token) {
        console.log('No authentication token found, redirecting to login')
        router.push('/simple-login')
        return
      }
      
      console.log('Loading properties with params:', {
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus,
        type: filterType
      })
      
      const response = await apiService.getAllProperties(
        pagination.page,
        pagination.limit,
        filterStatus === 'all' ? undefined : filterStatus,
        filterType === 'all' ? undefined : filterType
      )
      
      console.log('API response:', response)
      
      if (response.success) {
        // Sanitize properties data
        const sanitizedProperties = response.data.properties.map(sanitizeProperty)
        setProperties(sanitizedProperties)
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }))
      } else {
        setError(response.message || 'Failed to load properties')
      }
    } catch (err) {
      console.error('Failed to load properties:', err)
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page, pagination.limit, filterStatus, filterType])

  useEffect(() => {
    loadAllProperties()
  }, [pagination.page, filterStatus, filterType, loadAllProperties])

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
    router.push(`/properties/${propertyId}`)
  }

  const formatPrice = (price: number, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleRefresh = () => {
    loadAllProperties()
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Active
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-3 h-3 mr-1.5" />
            Pending Review
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3 h-3 mr-1.5" />
            Rejected
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200">
            <Clock className="w-3 h-3 mr-1.5" />
            Inactive
          </span>
        )
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Building className="w-4 h-4" />
      case 'house':
        return <Home className="w-4 h-4" />
      case 'commercial':
        return <Briefcase className="w-4 h-4" />
      case 'land':
        return <LandPlot className="w-4 h-4" />
      case 'condo':
        return <Building className="w-4 h-4" />
      case 'townhouse':
        return <Home className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      apartment: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
      house: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
      commercial: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200',
      land: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200',
      condo: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200',
      townhouse: 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border-teal-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${colors[type as keyof typeof colors] || 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200'}`}>
        {getTypeIcon(type)}
        <span className="ml-1.5">{safeCapitalize(type)}</span>
      </span>
    )
  }

  const getStatsCards = () => {
    const totalProperties = filteredProperties.length
    const highValueProperties = filteredProperties.filter(p => p.price && p.price > 1000000).length
    const verifiedOwners = filteredProperties.filter(p => p.user?.isVerified).length
    const recentProperties = filteredProperties.filter(p => {
      const daysDiff = (new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24)
      return daysDiff <= 7
    }).length

    return [
      {
        title: 'Total Properties',
        value: totalProperties,
        icon: <Home className="w-5 h-5" />,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100'
      },
      {
        title: 'High Value',
        value: highValueProperties,
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100'
      },
      {
        title: 'Verified Owners',
        value: verifiedOwners,
        icon: <CheckCircle2 className="w-5 h-5" />,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100'
      },
      {
        title: 'This Week',
        value: recentProperties,
        icon: <Calendar className="w-5 h-5" />,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-orange-50 to-orange-100'
      }
    ]
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">Error Loading Properties</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-slate-200/50">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900">
                All Properties
              </h1>
              <p className="text-slate-600 text-lg">Comprehensive property listing management and review system</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-slate-50 px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-slate-700">
                    {filteredProperties.length} of {pagination.total} properties
                  </span>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-3 rounded-xl hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 group border border-slate-200 shadow-sm"
              >
                <RefreshCw className={`w-5 h-5 text-slate-600 group-hover:text-slate-900 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsCards().map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors duration-200">
                  <div className="w-6 h-6 text-slate-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.title}</div>
                </div>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Filters and Search */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Properties</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                  placeholder="Search by title, location, owner name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-slate-50 focus:bg-white shadow-sm"
              />
              </div>
            </div>

              {/* Type Filter */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-slate-50 focus:bg-white shadow-sm"
              >
                <option value="all">All Property Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>

              {/* Status Filter */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-slate-50 focus:bg-white shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

              {/* Sort */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-slate-50 focus:bg-white shadow-sm"
              >
                <option value="createdAt">Date Created</option>
                <option value="price">Price</option>
                <option value="title">Title</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="lg:w-32">
              <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-slate-50 focus:bg-white shadow-sm"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

              {/* View Mode */}
            <div className="lg:w-32">
              <label className="block text-sm font-medium text-slate-700 mb-2">View</label>
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-slate-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-slate-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Display */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-slate-600 animate-spin" />
          </div>
                <p className="text-slate-600 font-medium">Loading properties...</p>
                <p className="text-slate-500 text-sm mt-1">Please wait while we fetch the latest data</p>
        </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
                  <div key={property.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                    <ImagePlaceholder 
                          src={property.featuredImage || property.images[0]}
                      alt={property.title}
                      width={400}
                      height={300}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                          propertyType={property.type}
                        />
                      </div>
                      <div className="absolute top-3 left-3">
                        {getStatusBadge(property.status)}
                      </div>
                      <div className="absolute top-3 right-3">
                        {getTypeBadge(property.type)}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-600 transition-colors">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-slate-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{property.location || `${property.city}, ${property.state}`}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold text-slate-900">
                          {formatPrice(property.price, property.currency)}
                        </div>
                        {property.listingType && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                            {property.listingType}
                    </span>
                        )}
                  </div>

                      {property.bedrooms && property.bathrooms && (
                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                          <span className="bg-slate-100 px-2 py-1 rounded-md">{property.bedrooms} bed</span>
                          <span className="bg-slate-100 px-2 py-1 rounded-md">{property.bathrooms} bath</span>
                          {property.size && <span className="bg-slate-100 px-2 py-1 rounded-md">{property.size} sqft</span>}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 text-xs font-semibold">
                              {safeUserInitials(property.user)}
                      </span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {safeUserDisplayName(property.user)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {property.user?.isVerified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>

                        <button
                          onClick={() => handleViewProperty(property.id)}
                          className="inline-flex items-center px-3 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                  </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Owner Information
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Property Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group">
                      <td className="px-6 py-6">
                    <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-xl mr-4 flex-shrink-0 overflow-hidden shadow-sm">
                            <ImagePlaceholder
                              src={property.featuredImage || property.images[0]}
                              alt={property.title}
                              width={64}
                              height={64}
                              className="w-full h-full"
                              propertyType={property.type}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-900 transition-colors">
                              {property.title}
                            </h3>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{property.location || `${property.city}, ${property.state}`}</span>
                            </div>
                            {property.bedrooms && property.bathrooms && (
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded-md mr-2">{property.bedrooms} bed</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-md mr-2">{property.bathrooms} bath</span>
                                {property.size && <span className="bg-gray-100 px-2 py-1 rounded-md">{property.size} sqft</span>}
                              </div>
                      )}
                    </div>
                    </div>
                      </td>
                      <td className="px-6 py-6">
                      <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white text-sm font-semibold">
                            {safeUserInitials(property.user)}
                          </span>
                        </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                            {safeUserDisplayName(property.user)}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              {property.user?.email || 'No email'}
                            </div>
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              {property.user?.isVerified ? 'Verified' : 'Unverified'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(property.price, property.currency)}
                        </div>
                        {property.listingType && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            {property.listingType}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        {getTypeBadge(property.type)}
                      </td>
                      <td className="px-6 py-6">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(property.createdAt).toLocaleTimeString()}
                      </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                      <button
                          onClick={() => handleViewProperty(property.id)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                        View
                      </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                    </div>
                  )}

          {filteredProperties.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Clock className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Properties Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'No properties match your current search criteria. Try adjusting your filters.' 
                  : 'No properties found. Check back later for new listings.'}
              </p>
              {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterType('all')
                    setFilterStatus('all')
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
            <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 px-6 py-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Showing {((pagination.page - 1) * pagination.limit) + 1}</span>
                  <span className="mx-1">to</span>
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                  <span className="mx-1">of</span>
                  <span className="font-medium">{pagination.total}</span>
                  <span className="ml-1">properties</span>
                </div>
            <div className="flex items-center space-x-2">
              <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = i + 1
                  return (
                    <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                            pagination.page === pageNum
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
                          }`}
                        >
                          {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Next
              </button>
                </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
