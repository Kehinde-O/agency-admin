'use client'

import { MapPin, Bed, Bath, Car, Square, Eye, Heart, MessageCircle, Star } from 'lucide-react'
import { Property } from '@/types'

interface PropertyOverviewCardProps {
  property: Property
}

export default function PropertyOverviewCard({ property }: PropertyOverviewCardProps) {
  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center text-slate-600 mb-4">
              <MapPin className="w-5 h-5 mr-3 text-slate-500" />
              <span className="text-lg font-medium">{property.location}</span>
            </div>
            
            {/* Price - Prominent */}
            <div className="flex items-baseline space-x-3 mb-6">
              <span className="text-5xl font-bold text-slate-900">
                {formatPrice(property.price, property.currency)}
              </span>
              {property.listingType && (
                <span className="text-xl text-slate-500 capitalize">
                  / {property.listingType}
                </span>
              )}
            </div>

            {/* Key Specs - Unified Design */}
            <div className="flex flex-wrap gap-4">
              {property.bedrooms && (
                <div className="flex items-center px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl">
                  <Bed className="w-5 h-5 mr-3 text-slate-600" />
                  <span className="font-semibold text-lg">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl">
                  <Bath className="w-5 h-5 mr-3 text-slate-600" />
                  <span className="font-semibold text-lg">{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              {property.size && (
                <div className="flex items-center px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl">
                  <Square className="w-5 h-5 mr-3 text-slate-600" />
                  <span className="font-semibold text-lg">{property.size.toLocaleString()} sq ft</span>
                </div>
              )}
              {property.parking && (
                <div className="flex items-center px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl">
                  <Car className="w-5 h-5 mr-3 text-slate-600" />
                  <span className="font-semibold text-lg">{property.parking} parking</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge - Right Aligned */}
          <div className="ml-8">
            <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold border ${getStatusColor(property.status)}`}>
              {property.status}
            </span>
          </div>
        </div>

        {/* Performance Metrics - Clean Grid */}
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <Eye className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {property.statistics?.totalViews || 0}
            </div>
            <div className="text-sm text-slate-600 font-medium">Views</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <Heart className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {property.statistics?.totalFavorites || 0}
            </div>
            <div className="text-sm text-slate-600 font-medium">Favorites</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <MessageCircle className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {property.statistics?.totalInquiries || 0}
            </div>
            <div className="text-sm text-slate-600 font-medium">Inquiries</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <Star className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {property.statistics?.averageRating ? property.statistics.averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-slate-600 font-medium">Rating</div>
          </div>
        </div>

        {/* Property Details - Bottom Section */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">Property Type</div>
              <div className="font-semibold text-slate-900 capitalize">{property.type}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">Last Updated</div>
              <div className="font-semibold text-slate-900">
                {new Date(property.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">Property ID</div>
              <div className="font-mono text-sm text-slate-500">{property.id.slice(0, 8)}...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
