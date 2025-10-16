'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Home, Building, LandPlot, Briefcase } from 'lucide-react'

interface ImagePlaceholderProps {
  src?: string
  alt: string
  width: number
  height: number
  className?: string
  propertyType?: string
  onError?: () => void
}

export default function ImagePlaceholder({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  propertyType = 'house',
  onError 
}: ImagePlaceholderProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleError = () => {
    setImageError(true)
    setImageLoading(false)
    onError?.()
  }

  const handleLoad = () => {
    setImageLoading(false)
  }

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
      case 'condo':
        return <Building className="w-8 h-8" />
      case 'house':
      case 'townhouse':
        return <Home className="w-8 h-8" />
      case 'commercial':
        return <Briefcase className="w-8 h-8" />
      case 'land':
        return <LandPlot className="w-8 h-8" />
      default:
        return <Home className="w-8 h-8" />
    }
  }

  if (imageError || !src) {
    return (
      <div className={`bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-slate-400 mb-2">
            {getPropertyIcon(propertyType)}
          </div>
          <p className="text-xs text-slate-500 font-medium">No Image</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center z-10">
          <div className="animate-pulse">
            <div className="text-slate-400">
              {getPropertyIcon(propertyType)}
            </div>
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
}
