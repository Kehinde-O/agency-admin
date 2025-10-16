'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
  quality?: number
}

export default function SafeImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fallbackSrc = '/placeholder-image.png',
  priority = false,
  quality = 75
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImageSrc(fallbackSrc)
    }
  }

  // If the image has errored and we don't have a fallback, show a placeholder
  if (hasError && imageSrc === fallbackSrc && !fallbackSrc.startsWith('/')) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      onError={handleError}
      unoptimized={src.includes('r2.dev') || src.includes('cloudflare')}
    />
  )
}
