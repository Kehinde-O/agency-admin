'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Play, X, Maximize2 } from 'lucide-react'

interface PropertyImageGalleryProps {
  images: string[]
  videos?: string[]
  title: string
}

export default function PropertyImageGallery({ images, videos, title }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const allMedia = [
    ...images.map((url, index) => ({ type: 'image', url, index })),
    ...(videos || []).map((url, index) => ({ type: 'video', url, index: images.length + index }))
  ]

  const currentMedia = allMedia[currentIndex]
  const totalMedia = allMedia.length

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalMedia)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalMedia) % totalMedia)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % totalMedia)
  }

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + totalMedia) % totalMedia)
  }

  if (totalMedia === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏠</span>
          </div>
          <p className="text-purple-600 font-medium">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="relative w-full bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Hero Image */}
        <div className="relative aspect-video bg-gray-100">
          {currentMedia?.type === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                src={currentMedia.url}
                className="w-full h-full object-cover"
                controls
                poster={images[0] || undefined}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="w-16 h-16 text-white" />
              </div>
            </div>
          ) : (
            <img
              src={currentMedia?.url || images[0]}
              alt={title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openLightbox(currentIndex)}
            />
          )}

          {/* Navigation Arrows */}
          {totalMedia > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {totalMedia}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => openLightbox(currentIndex)}
            className="absolute bottom-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Strip */}
        {totalMedia > 1 && (
          <div className="p-4 bg-white">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {allMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                    index === currentIndex
                      ? 'ring-2 ring-purple-500 scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
                      <Play className="w-4 h-4 text-gray-600" />
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-purple-500/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Arrows */}
            {totalMedia > 1 && (
              <>
                <button
                  onClick={prevLightbox}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Media Display */}
            <div className="w-full h-full flex items-center justify-center">
              {allMedia[lightboxIndex]?.type === 'video' ? (
                <video
                  src={allMedia[lightboxIndex].url}
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={allMedia[lightboxIndex]?.url}
                  alt={title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
              {lightboxIndex + 1} / {totalMedia}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
