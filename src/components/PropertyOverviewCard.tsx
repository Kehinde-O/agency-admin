'use client'

import { MapPin, Bed, Bath, Car, Square, Eye, Heart, MessageCircle, Star, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Property } from '@/types'

interface PropertyOverviewCardProps {
  property: Property
}

export default function PropertyOverviewCard({ property }: PropertyOverviewCardProps) {
  const [copiedId, setCopiedId] = useState(false)

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const copyPropertyId = async () => {
    try {
      await navigator.clipboard.writeText(property.id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } catch (error) {
      console.error('Failed to copy property ID:', error)
    }
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
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Property Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {property.title}
          </h1>
          
          {/* Property Description */}
          {property.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {property.description}
            </p>
          )}
          
          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">{property.address}</span>
          </div>
        </div>

        {/* Price and Status Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(property.price, property.currency)}
            </span>
            {property.listingType && (
              <span className="text-sm text-gray-500 capitalize">
                / {property.listingType}
              </span>
            )}
          </div>
          
          {/* Status Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {property.bedrooms && (
            <div className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">
              <Bed className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">
              <Bath className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium">{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {property.size && (
            <div className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">
              <Square className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium">{property.size.toLocaleString()} sq ft</span>
            </div>
          )}
          {property.parking && (
            <div className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">
              <Car className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium">{property.parking} parking</span>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property Type */}
            <div className="text-left">
              <div className="text-xs text-gray-500 mb-1">Property Type</div>
              <div className="text-sm font-medium text-gray-900 capitalize">{property.propertyType}</div>
            </div>

            {/* Last Updated */}
            <div className="text-left">
              <div className="text-xs text-gray-500 mb-1">Last Updated</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date(property.updatedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Property ID with Copy */}
            <div className="text-left">
              <div className="text-xs text-gray-500 mb-1">Property ID</div>
              <div className="flex items-center space-x-2">
                <div className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded border flex-1">
                  {property.id}
                </div>
                <button
                  onClick={copyPropertyId}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy Property ID"
                >
                  {copiedId ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
