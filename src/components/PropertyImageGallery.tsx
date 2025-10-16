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
      <div className="relative w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-purple-200/50">
        {/* Hero Image */}
        <div className="relative aspect-video bg-gradient-to-br from-purple-50 to-purple-100">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border border-purple-200/50"
              >
                <ChevronLeft className="w-6 h-6 text-purple-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 border border-purple-200/50"
              >
                <ChevronRight className="w-6 h-6 text-purple-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            {currentIndex + 1} / {totalMedia}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => openLightbox(currentIndex)}
            className="absolute bottom-4 right-4 w-12 h-12 bg-purple-600/90 hover:bg-purple-700/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Strip */}
        {totalMedia > 1 && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex flex-wrap gap-2 justify-center">
              {allMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                    index === currentIndex
                      ? 'ring-2 ring-purple-500 scale-110 shadow-lg'
                      : 'hover:scale-105 hover:ring-1 hover:ring-purple-300'
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="relative w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                      <Play className="w-3 h-3 text-purple-600" />
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-purple-500/30 border-2 border-purple-500 rounded-xl" />
                  )}
                  {/* Active indicator */}
                  {index === currentIndex && (
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-purple-600/90 hover:bg-purple-700/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {totalMedia > 1 && (
              <>
                <button
                  onClick={prevLightbox}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-purple-600/90 hover:bg-purple-700/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={nextLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-purple-600/90 hover:bg-purple-700/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}

            {/* Media Display */}
            <div className="w-full h-full flex items-center justify-center">
              {allMedia[lightboxIndex]?.type === 'video' ? (
                <video
                  src={allMedia[lightboxIndex].url}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={allMedia[lightboxIndex]?.url}
                  alt={title}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              )}
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-purple-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
              {lightboxIndex + 1} / {totalMedia}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
