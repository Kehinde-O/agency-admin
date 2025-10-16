'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Edit, Plus, Minus } from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  currency: string
  latitude: number
  longitude: number
  featuredImage?: string
  type: string
}

interface GoogleMapViewProps {
  properties: Property[]
  selectedProperty?: string | null
  onPropertySelect?: (propertyId: string) => void
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function GoogleMapView({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  center,
  zoom = 12,
  height = '400px',
  className = ''
}: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapZoom, setMapZoom] = useState(zoom)
  const [mapCenter, setMapCenter] = useState(center || { lat: 6.5244, lng: 3.3792 }) // Lagos coordinates

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDnZyWDH9hqHvzw6ewgPmBqXzNpH1loSQA'

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap()
        return
      }

      // Check if script already exists to avoid duplicate loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        // Script already exists, just initialize
        window.initMap = initializeMap
        if (window.google) {
          initializeMap()
        }
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      
      window.initMap = initializeMap
      document.head.appendChild(script)
    }

    loadGoogleMaps()

    return () => {
      // Clean up markers when component unmounts
      if (markersRef.current) {
        markersRef.current.forEach(marker => {
          if (marker && marker.setMap) {
            marker.setMap(null)
          }
        })
        markersRef.current = []
      }
      
      // Clean up map instance
      if (mapInstance.current) {
        mapInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && mapInstance.current) {
      updateMarkers()
    }
  }, [properties, selectedProperty, isLoaded])

  const initializeMap = () => {
    // Validate that the map container exists and is a valid DOM element
    if (!mapRef.current || !window.google || !mapRef.current.isConnected) {
      console.warn('GoogleMapView: Map container not ready or not connected to DOM')
      return
    }

    try {
      const mapOptions = {
        center: mapCenter,
        zoom: mapZoom,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9c9c9' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#757575' }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }

      mapInstance.current = new window.google.maps.Map(mapRef.current, mapOptions)
      setIsLoaded(true)
      updateMarkers()
    } catch (error) {
      console.error('GoogleMapView: Error initializing map:', error)
      setIsLoaded(false)
    }
  }

  const updateMarkers = () => {
    if (!mapInstance.current || !window.google) return

    try {
      // Clear existing markers safely
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null)
        }
      })
      markersRef.current = []

      properties.forEach((property, index) => {
        // Validate property coordinates
        if (!property.latitude || !property.longitude || 
            isNaN(property.latitude) || isNaN(property.longitude)) {
          console.warn(`GoogleMapView: Invalid coordinates for property ${property.id}`)
          return
        }

        const marker = new window.google.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map: mapInstance.current,
          title: property.title,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${selectedProperty === property.id ? '#ef4444' : '#3b82f6'}" stroke="white" stroke-width="3"/>
                <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${index + 1}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          },
          animation: selectedProperty === property.id ? window.google.maps.Animation.BOUNCE : null
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm">${property.title}</h3>
              <p class="text-xs text-gray-600">${formatPrice(property.price, property.currency)}</p>
              <p class="text-xs text-gray-500">${property.type}</p>
            </div>
          `
        })

        marker.addListener('click', () => {
          onPropertySelect?.(property.id)
          infoWindow.open(mapInstance.current, marker)
        })

        markersRef.current.push(marker)
      })
    } catch (error) {
      console.error('GoogleMapView: Error updating markers:', error)
    }
  }

  const handleZoomIn = () => {
    if (mapInstance.current) {
      const currentZoom = mapInstance.current.getZoom()
      mapInstance.current.setZoom(currentZoom + 1)
      setMapZoom(currentZoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (mapInstance.current) {
      const currentZoom = mapInstance.current.getZoom()
      mapInstance.current.setZoom(currentZoom - 1)
      setMapZoom(currentZoom - 1)
    }
  }

  const handleReset = () => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(mapCenter)
      mapInstance.current.setZoom(zoom)
      setMapZoom(zoom)
    }
  }

  const formatPrice = (price: number, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '300px' }}
        onLoad={() => {
          // Ensure the map container is ready before initializing
          if (window.google && mapRef.current && !mapInstance.current) {
            setTimeout(() => initializeMap(), 100)
          }
        }}
      />

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
          <span className="text-sm font-medium text-slate-900">Property Location</span>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} in this area
        </p>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
        <span className="text-sm font-medium text-slate-900">Zoom: {mapZoom}</span>
      </div>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
