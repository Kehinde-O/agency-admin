'use client'

import { useState } from 'react'
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  Bookmark,
  MessageCircle,
  Eye,
  TrendingUp
} from 'lucide-react'
import ImagePlaceholder from './ImagePlaceholder'
import { Property } from '@/types'

interface PropertyCardProps {
  property: Property
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  onFavorite?: (propertyId: string) => void
  onShare?: (propertyId: string) => void
  onView?: (propertyId: string) => void
  isSelected?: boolean
  className?: string
}

export default function PropertyCard({
  property,
  variant = 'default',
  showActions = true,
  onFavorite,
  onShare,
  onView,
  isSelected = false,
  className = ''
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  const formatPrice = (price: number, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    onFavorite?.(property.id)
  }

  const handleShare = () => {
    onShare?.(property.id)
  }

  const handleView = () => {
    onView?.(property.id)
  }

  if (variant === 'compact') {
    return (
      <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
      } ${className}`}>
        <div className="flex space-x-3">
          <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
            <ImagePlaceholder
              src={property.featuredImage || property.images[0]}
              alt={property.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              propertyType={property.type}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-900">{formatPrice(property.price, property.currency)}</p>
                <p className="text-sm text-slate-600 truncate">{property.location || `${property.city}, ${property.state}`}</p>
              </div>
              <button 
                onClick={handleFavorite}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-slate-600'}`} />
              </button>
            </div>
            <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
              {property.bedrooms && <span>{property.bedrooms} bed</span>}
              {property.bathrooms && <span>{property.bathrooms} bath</span>}
              {property.size && <span>{property.size} ft²</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
        {/* Image Section */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden">
            <ImagePlaceholder
              src={property.featuredImage || property.images[0]}
              alt={property.title}
              width={400}
              height={300}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              propertyType={property.type}
            />
          </div>
          
          {/* Overlay Elements */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-slate-900">4.8</span>
            </div>
          </div>
          
          <div className="absolute top-4 right-4">
            <button 
              onClick={handleFavorite}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-slate-600'}`} />
            </button>
          </div>
          
          {/* Image Dots Indicator */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.slice(0, 5).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-600">Most popular</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <button 
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{property.title}</h3>
              <div className="flex items-center text-slate-600 mb-2">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span className="text-sm">{property.location || `${property.city}, ${property.state}`}</span>
              </div>
            </div>

            {/* Property Features */}
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              {property.bedrooms && (
                <div className="flex items-center space-x-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center space-x-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.size && (
                <div className="flex items-center space-x-1">
                  <Square className="w-4 h-4" />
                  <span>{property.size} ft²</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed">
              {property.description?.substring(0, 150)}...
              <button className="text-slate-900 font-medium ml-1 hover:underline">see details</button>
            </p>

            {/* Price */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Rental price</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatPrice(property.price, property.currency)}
                  </p>
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
                  <MessageCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleView}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Show contacts</span>
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <ImagePlaceholder
            src={property.featuredImage || property.images[0]}
            alt={property.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            propertyType={property.type}
          />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
            {property.status}
          </span>
        </div>
        
        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <button 
            onClick={handleFavorite}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-slate-600'}`} />
          </button>
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
        
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handleView}
              className="inline-flex items-center px-3 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View Details
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
