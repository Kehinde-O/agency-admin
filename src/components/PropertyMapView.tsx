'use client'

import { useState } from 'react'
import { MapPin, Maximize2, Navigation, Layers, Eye } from 'lucide-react'
import GoogleMapView from './GoogleMapView'

interface PropertyMapViewProps {
  property: {
    id: string
    title: string
    price: number
    currency?: string
    latitude?: number
    longitude?: number
    location: string
    featuredImage?: string
    type: string
  }
}

export default function PropertyMapView({ property }: PropertyMapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap')

  if (!property.latitude || !property.longitude || 
      isNaN(property.latitude) || isNaN(property.longitude)) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mr-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Property Location</h3>
              <p className="text-sm text-slate-600">Interactive map view</p>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Location Not Available</h4>
            <p className="text-slate-600">This property doesn't have valid location coordinates.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Property Location</h3>
                <p className="text-sm text-slate-600">{property.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
                className="inline-flex items-center px-3 py-2 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Layers className="w-4 h-4 mr-1" />
                {mapType === 'roadmap' ? 'Satellite' : 'Road'}
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="inline-flex items-center px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Maximize2 className="w-4 h-4 mr-1" />
                Fullscreen
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative h-96 rounded-xl overflow-hidden">
            <GoogleMapView
              properties={[{
                id: property.id,
                title: property.title,
                price: property.price,
                currency: property.currency || 'NGN',
                latitude: property.latitude,
                longitude: property.longitude,
                featuredImage: property.featuredImage,
                type: property.type
              }]}
              selectedProperty={property.id}
              onPropertySelect={() => {}}
              center={{
                lat: property.latitude,
                lng: property.longitude
              }}
              height="100%"
              className="rounded-xl"
            />
            
            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{property.title}</div>
                  <div className="text-xs text-slate-600">{property.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-slate-50 rounded-xl">
              <Navigation className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-slate-600">Coordinates</div>
                <div className="text-slate-900 font-semibold text-sm">
                  {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-slate-50 rounded-xl">
              <Eye className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-slate-600">View Type</div>
                <div className="text-slate-900 font-semibold text-sm capitalize">
                  {mapType} view
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-slate-600">Location</div>
                <div className="text-slate-900 font-semibold text-sm">
                  {property.location.split(',')[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="w-full h-full relative">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white text-slate-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
            >
              <span className="text-xl">×</span>
            </button>

            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
              <button
                onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
                className="inline-flex items-center px-3 py-2 bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-medium rounded-lg hover:bg-white transition-colors shadow-lg"
              >
                <Layers className="w-4 h-4 mr-1" />
                {mapType === 'roadmap' ? 'Satellite' : 'Road'}
              </button>
            </div>

            {/* Fullscreen Map */}
            <GoogleMapView
              properties={[{
                id: property.id,
                title: property.title,
                price: property.price,
                currency: property.currency || 'NGN',
                latitude: property.latitude,
                longitude: property.longitude,
                featuredImage: property.featuredImage,
                type: property.type
              }]}
              selectedProperty={property.id}
              onPropertySelect={() => {}}
              center={{
                lat: property.latitude,
                lng: property.longitude
              }}
              height="100%"
              className="rounded-none"
            />
          </div>
        </div>
      )}
    </>
  )
}
