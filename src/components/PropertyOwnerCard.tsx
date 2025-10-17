'use client'

import { User, Mail, Phone, Calendar, Star, Building, MessageCircle, ExternalLink, Shield, CheckCircle } from 'lucide-react'
import { Property } from '@/types'

interface PropertyOwnerCardProps {
  property: Property
}

export default function PropertyOwnerCard({ property }: PropertyOwnerCardProps) {
  const owner = property.user || property.owner
  const agent = property.agent

  const safeUserInitials = (user: any) => {
    if (!user) return 'U'
    const firstName = user.firstName || user.name || ''
    const lastName = user.lastName || ''
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U'
  }

  const safeUserDisplayName = (user: any) => {
    if (!user) return 'Unknown Owner'
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.name) return user.name
    return user.email?.split('@')[0] || 'Unknown Owner'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Property Owner</h3>
              <p className="text-sm text-gray-600">Contact information and details</p>
            </div>
          </div>
          
          {/* Owner Status Badge */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
              owner?.isVerified 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
              {owner?.isVerified ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Unverified
                </>
              )}
            </span>
            {owner?.isAgent && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                <Building className="w-3 h-3 mr-1" />
                Agent
              </span>
            )}
          </div>
        </div>

        {/* Owner Profile Section */}
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-700 font-bold text-lg">
              {safeUserInitials(owner)}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-1">
              {safeUserDisplayName(owner)}
            </h4>
            <p className="text-sm text-gray-500">
              Member since {owner ? new Date(owner.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>

        {/* Contact Information & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h5>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-600 mr-3" />
                <div>
                  <div className="text-xs font-medium text-gray-500">Email</div>
                  <div className="text-sm text-gray-900 font-medium">{owner?.email || 'No email provided'}</div>
                </div>
              </div>

              {owner?.phone && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-600 mr-3" />
                  <div>
                    <div className="text-xs font-medium text-gray-500">Phone</div>
                    <div className="text-sm text-gray-900 font-medium">{owner.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

            {/* Owner Stats */}
            {owner && (
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Owner Statistics</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {owner.listingsCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Total Listings</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {(() => {
                        const rating = owner?.rating;
                        if (rating === null || rating === undefined) return '0.0';
                        if (typeof rating === 'number') return rating.toFixed(1);
                        if (typeof rating === 'string') {
                          const numRating = parseFloat(rating);
                          return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
                        }
                        return '0.0';
                      })()}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Rating</div>
                  </div>
                </div>
                {owner.reviewsCount && owner.reviewsCount > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {owner.reviewsCount}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Reviews Received</div>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Agent Information (if applicable) */}
        {agent && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Assigned Agent</h4>
                <p className="text-sm text-gray-600">Property management agent</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-700 font-bold text-sm">
                  {safeUserInitials(agent)}
                </span>
              </div>
              <div className="flex-1">
                <h5 className="text-lg font-bold text-gray-900 mb-1">
                  {safeUserDisplayName(agent)}
                </h5>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                    agent.isVerified 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  }`}>
                    {agent.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  {agent.licenseNumber && (
                    <span className="text-xs text-gray-500">
                      License: {agent.licenseNumber}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {agent.experience ? `${agent.experience} years experience` : 'Professional Agent'}
                </p>
              </div>
            </div>

            {agent.companyName && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-gray-500 mb-1">Company</div>
                <div className="text-sm text-gray-900 font-medium">{agent.companyName}</div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Owner
          </button>
          <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </button>
          <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Building className="w-4 h-4 mr-2" />
            All Listings
          </button>
        </div>
      </div>
    </div>
  )
}
