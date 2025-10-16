'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Edit, Plus, Minus } from 'lucide-react'

interface PropertyMapProps {
  properties: Array<{
    id: string
    title: string
    price: number
    currency: string
    latitude: number
    longitude: number
    featuredImage?: string
    type: string
  }>
  selectedProperty?: string | null
  onPropertySelect?: (propertyId: string) => void
  center?: { lat: number; lng: number }
  zoom?: number
}

export default function PropertyMap({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  center,
  zoom = 12
}: PropertyMapProps) {
  const [mapZoom, setMapZoom] = useState(zoom)
  const [mapCenter, setMapCenter] = useState(center || { lat: 6.5244, lng: 3.3792 }) // Lagos coordinates
  const [isDragging, setIsDragging] = useState(false)

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1))
  }

  const handleReset = () => {
    setMapZoom(zoom)
    setMapCenter(center || { lat: 6.5244, lng: 3.3792 })
  }

  const formatPrice = (price: number, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="relative h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Property Markers */}
      {properties.map((property, index) => (
        <div
          key={property.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${20 + (index * 15)}%`,
            top: `${30 + (index * 10)}%`,
          }}
          onClick={() => onPropertySelect?.(property.id)}
        >
          <div className="relative">
            {/* Property Marker */}
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all ${
              selectedProperty === property.id 
                ? 'bg-red-500 scale-125' 
                : 'bg-blue-500 hover:scale-110'
            }`} />
            
            {/* Price Label */}
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedProperty === property.id
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-900 shadow-md'
            }`}>
              {formatPrice(property.price, property.currency)}
            </div>
            
            {/* Property Type Indicator */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Search Area Indicator */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-blue-400 border-dashed rounded-lg bg-blue-100/20">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-400 rounded-full"></div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
        {/* Edit Button */}
        <button className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors">
          <Edit className="w-4 h-4 text-slate-600" />
        </button>
        
        {/* Zoom Controls */}
        <div className="flex flex-col space-y-1">
          <button 
            onClick={handleZoomIn}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-600" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors"
          >
            <Minus className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        
        {/* Reset Button */}
        <button 
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Map Info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-900">Map View</span>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          {properties.length} properties in this area
        </p>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
        <span className="text-sm font-medium text-slate-900">Zoom: {mapZoom}</span>
      </div>
    </div>
  )
}
