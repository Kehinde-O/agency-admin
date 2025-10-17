'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Share2, Bookmark, AlertTriangle } from 'lucide-react'
import { Property } from '@/types'
import { apiService } from '@/lib/api'
import { usePageTitle } from '@/contexts/PageContext'
import { useNotification } from '@/contexts/NotificationContext'
import { sanitizeProperty } from '@/lib/error-handler'

// Import all the new components
import PropertyImageGallery from '@/components/PropertyImageGallery'
import PropertyOverviewCard from '@/components/PropertyOverviewCard'
import PropertyMapView from '@/components/PropertyMapView'
import PropertyOwnerCard from '@/components/PropertyOwnerCard'
import PropertyBookingsList from '@/components/PropertyBookingsList'
import PropertyAnalytics from '@/components/PropertyAnalytics'
import PropertyReviews from '@/components/PropertyReviews'
import ApprovalHistoryTimeline from '@/components/ApprovalHistoryTimeline'
import PropertyApprovalActions from '@/components/PropertyApprovalActions'
import PropertyQualityScore from '@/components/PropertyQualityScore'
import PropertyPriceAnalysis from '@/components/PropertyPriceAnalysis'

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState<Property | null>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { setPageTitle } = usePageTitle()
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setIsLoading(true)
        
        // Check if we have authentication token
        const token = localStorage.getItem('adminToken')
        if (!token) {
          console.log('No authentication token found, redirecting to login')
          router.push('/')
          return
        }
        
        const response = await apiService.getPropertyById(params.id as string)
        
        console.log('Property API response:', response)
        
        if (response.success) {
          setProperty(response.data.property)
          // Set page title with property name
          setPageTitle(response.data.property.title, 'Property details and management')
          // Load bookings
          loadBookings(params.id as string)
          // Load similar properties
          loadSimilarProperties(response.data.property)
        } else {
          console.error('Failed to load property:', response.message)
        }
      } catch (error) {
        console.error('Failed to load property:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadProperty()
    }
  }, [params.id, setPageTitle])

  const loadBookings = async (propertyId: string) => {
    try {
      const response = await apiService.getPropertyBookings(propertyId)
      if (response.success) {
        setBookings(response.data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  const loadSimilarProperties = async (currentProperty: Property) => {
    try {
      const response = await apiService.getSimilarProperties(currentProperty.id)
      if (response.success) {
        setSimilarProperties(response.data.properties || [])
      }
    } catch (error) {
      console.error('Failed to load similar properties:', error)
    }
  }

  const handleApprove = async (reason?: string) => {
    if (!property) return
    
    try {
      setIsProcessing(true)
      const response = await apiService.approveProperty(property.id, reason)
      
      if (response.success) {
        setProperty({ ...property, status: 'ACTIVE' })
        showSuccess(
          'Property Approved',
          'Property is now visible on the mobile app and available for users to view and book.'
        )
      } else {
        throw new Error(response.message || 'Failed to approve property')
      }
    } catch (error: any) {
      console.error('Failed to approve property:', error)
      showError(
        'Approval Failed',
        error.message || 'Unable to approve property. Please check your connection and try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!property) return
    
    try {
      setIsProcessing(true)
      const response = await apiService.rejectProperty(property.id, reason)
      
      if (response.success) {
        setProperty({ ...property, status: 'REJECTED' })
        showSuccess(
          'Property Rejected',
          'Property has been rejected and will not be visible to users.'
        )
      } else {
        throw new Error(response.message || 'Failed to reject property')
      }
    } catch (error: any) {
      console.error('Failed to reject property:', error)
      showError(
        'Rejection Failed',
        error.message || 'Unable to reject property. Please check your connection and try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePullDown = async (reason: string) => {
    if (!property) return
    
    try {
      setIsProcessing(true)
      const response = await apiService.pullDownProperty(property.id, reason)
      
      if (response.success) {
        setProperty({ ...property, status: 'INACTIVE' })
        alert('Property pulled down successfully.')
      } else {
        throw new Error(response.message || 'Failed to pull down property')
      }
    } catch (error) {
      console.error('Failed to pull down property:', error)
      alert('Failed to pull down property. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReactivate = async (reason?: string) => {
    if (!property) return
    
    try {
      setIsProcessing(true)
      const response = await apiService.reactivateProperty(property.id, reason)
      
      if (response.success) {
        setProperty({ ...property, status: 'ACTIVE' })
        alert('Property reactivated successfully.')
      } else {
        throw new Error(response.message || 'Failed to reactivate property')
      }
    } catch (error) {
      console.error('Failed to reactivate property:', error)
      alert('Failed to reactivate property. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/dashboard/properties/${property?.id}/edit`)
  }

  // Removed flag functionality - all properties must be approved before displaying

  const handleContact = () => {
    if (property?.user?.email) {
      window.open(`mailto:${property.user.email}`, '_blank')
    }
  }

  const handleViewMobile = () => {
    // Open property in mobile app or preview
    window.open(`/property/${property?.id}`, '_blank')
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      // Implement delete functionality
      console.log('Delete property:', property?.id)
    }
  }

  const handleExport = () => {
    // Implement export functionality
    console.log('Export property data:', property?.id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Property Not Found</h2>
          <p className="text-slate-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

      {/* Main Content */}
      <div className="max-w-full mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area - 8/12 width (col-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Image Gallery */}
            <PropertyImageGallery
              images={property.images || []}
              videos={property.videos || []}
              title={property.title}
            />

            {/* Property Overview */}
            <PropertyOverviewCard property={property} />

            {/* Property Owner */}
            <PropertyOwnerCard property={property} />

            {/* Interactive Map - Moved to main content */}
            <PropertyMapView property={property} />

            {/* Approval History */}
            <ApprovalHistoryTimeline property={property} />
          </div>

          {/* Sidebar - 4/12 width (col-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Admin Actions */}
            <PropertyApprovalActions
              property={property}
              onApprove={handleApprove}
              onReject={handleReject}
              onPullDown={handlePullDown}
              onReactivate={handleReactivate}
              onEdit={handleEdit}
              onContact={handleContact}
              onViewMobile={handleViewMobile}
              onDelete={handleDelete}
              onExport={handleExport}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
