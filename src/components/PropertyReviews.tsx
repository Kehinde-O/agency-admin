'use client'

import { Star, User, Calendar, ThumbsUp, MessageCircle } from 'lucide-react'
import { Property } from '@/types'

interface PropertyReviewsProps {
  property: Property
}

export default function PropertyReviews({ property }: PropertyReviewsProps) {
  const reviews = property.recentReviews || []
  const stats = property.statistics || { averageRating: 0, totalReviews: 0 }

  const renderStars = (rating: number) => {
    const safeRating = rating || 0
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(safeRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mr-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Property Reviews</h3>
              <p className="text-sm text-slate-600">User feedback and ratings</p>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">No Reviews Yet</h4>
            <p className="text-slate-600">This property hasn't received any reviews from users.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mr-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Property Reviews</h3>
              <p className="text-sm text-slate-600">{stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex items-center">
                {renderStars(stats.averageRating)}
              </div>
              <span className="text-2xl font-bold text-slate-900 ml-2">
                {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="text-sm text-slate-600">Average Rating</div>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={review.id || index} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  {review.user.profileImage ? (
                    <img
                      src={review.user.profileImage}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-purple-700 font-bold text-lg">
                      {review.user.firstName?.charAt(0)}{review.user.lastName?.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {review.user.firstName} {review.user.lastName}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(review.rating || 0)}
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Helpful
                      </button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center space-x-4 pt-3 border-t border-slate-100">
                    <button className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Reply
                    </button>
                    <button className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors">
                      <User className="w-3 h-3 mr-1" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {reviews.length >= 5 && (
          <div className="text-center mt-8">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              <MessageCircle className="w-4 h-4 mr-2" />
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
