'use client'

import { TrendingUp, Eye, Heart, MessageCircle, Star, Calendar, MapPin, Users } from 'lucide-react'
import { Property } from '@/types'

interface PropertyAnalyticsProps {
  property: Property
}

export default function PropertyAnalytics({ property }: PropertyAnalyticsProps) {
  const stats = property.statistics || {
    totalViews: 0,
    totalFavorites: 0,
    totalInquiries: 0,
    averageRating: 0,
    totalReviews: 0
  }

  const recentActivity = property.recentActivity || []
  const recentViews = property.recentViews || []
  const recentFavorites = property.recentFavorites || []

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
            <TrendingUp className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Performance Analytics</h3>
            <p className="text-slate-600">Property engagement and interaction metrics</p>
          </div>
        </div>

        {/* Key Metrics - Clean Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <Eye className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalViews}</div>
            <div className="text-sm text-slate-600 font-medium">Total Views</div>
            <div className="text-xs text-slate-500 mt-1">+12% this month</div>
          </div>

          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <Heart className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalFavorites}</div>
            <div className="text-sm text-slate-600 font-medium">Favorites</div>
            <div className="text-xs text-slate-500 mt-1">+8% this month</div>
          </div>

          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <MessageCircle className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalInquiries}</div>
            <div className="text-sm text-slate-600 font-medium">Inquiries</div>
            <div className="text-xs text-slate-500 mt-1">+15% this month</div>
          </div>

          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <Star className="w-6 h-6 text-slate-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-slate-600 font-medium">Rating</div>
            <div className="text-xs text-slate-500 mt-1">{stats.totalReviews} reviews</div>
          </div>
        </div>

        {/* Performance Insights - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {((stats.totalFavorites / Math.max(stats.totalViews, 1)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600 font-medium">Favorite Rate</div>
            <div className="text-xs text-slate-500">Users who favorited this property</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {((stats.totalInquiries / Math.max(stats.totalViews, 1)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600 font-medium">Inquiry Rate</div>
            <div className="text-xs text-slate-500">Users who inquired about this property</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-2xl">
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {stats.averageRating ? (stats.averageRating >= 4.5 ? 'Excellent' : stats.averageRating >= 3.5 ? 'Good' : stats.averageRating >= 2.5 ? 'Average' : 'Poor') : 'No Rating'}
            </div>
            <div className="text-sm text-slate-600 font-medium">Quality Rating</div>
            <div className="text-xs text-slate-500">Based on user reviews</div>
          </div>
        </div>

        {/* Recent Activity - Combined */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-slate-600" />
              Recent Activity
            </h4>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 4).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                      <TrendingUp className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{activity.type}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="font-medium">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-3 text-slate-600" />
              Recent Views
            </h4>
            <div className="space-y-3">
              {recentViews.length > 0 ? (
                recentViews.slice(0, 4).map((view, index) => (
                  <div key={view.id || index} className="flex items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                      <Eye className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">
                        {view.user ? `${view.user.firstName} ${view.user.lastName}` : 'Anonymous User'}
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(view.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="font-medium">No recent views</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
