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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Property Owner</h3>
            <p className="text-slate-600">Contact information and details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Owner Information */}
          <div className="space-y-6">
            {/* Owner Profile */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center shadow-sm">
                <span className="text-slate-700 font-bold text-2xl">
                  {safeUserInitials(owner)}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-slate-900 mb-2">
                  {safeUserDisplayName(owner)}
                </h4>
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold ${
                    owner?.isVerified 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  }`}>
                    {owner?.isVerified ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verified
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Unverified
                      </>
                    )}
                  </span>
                  {owner?.isAgent && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                      <Building className="w-4 h-4 mr-2" />
                      Agent
                    </span>
                  )}
                </div>
                <p className="text-slate-500">
                  Member since {owner ? new Date(owner.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
                <Mail className="w-5 h-5 text-slate-600 mr-4" />
                <div>
                  <div className="text-sm font-medium text-slate-600">Email Address</div>
                  <div className="text-slate-900 font-semibold">{owner?.email || 'No email provided'}</div>
                </div>
              </div>

              {owner?.phone && (
                <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
                  <Phone className="w-5 h-5 text-slate-600 mr-4" />
                  <div>
                    <div className="text-sm font-medium text-slate-600">Phone Number</div>
                    <div className="text-slate-900 font-semibold">{owner.phone}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Owner Stats - Simplified */}
            {owner && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {owner.listingsCount || 0}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">Total Listings</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">
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
                  <div className="text-sm text-slate-600 font-medium">Owner Rating</div>
                </div>
              </div>
            )}
          </div>

          {/* Agent Information (if applicable) */}
          {agent && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
                  <Building className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Assigned Agent</h4>
                  <p className="text-slate-600">Property management agent</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center shadow-sm">
                  <span className="text-slate-700 font-bold text-xl">
                    {safeUserInitials(agent)}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="text-xl font-bold text-slate-900 mb-2">
                    {safeUserDisplayName(agent)}
                  </h5>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold ${
                      agent.isVerified 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {agent.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    {agent.licenseNumber && (
                      <span className="text-sm text-slate-500">
                        License: {agent.licenseNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500">
                    {agent.experience ? `${agent.experience} years experience` : 'Professional Agent'}
                  </p>
                </div>
              </div>

              {agent.companyName && (
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="text-sm font-medium text-slate-600 mb-1">Company</div>
                  <div className="text-slate-900 font-semibold">{agent.companyName}</div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Full Width */}
          <div className="lg:col-span-2 flex flex-wrap gap-4 pt-6 border-t border-slate-200">
            <button className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-2xl hover:bg-slate-800 transition-all duration-200">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Owner
            </button>
            <button className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-2xl hover:bg-slate-200 transition-all duration-200">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </button>
            <button className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-2xl hover:bg-slate-200 transition-all duration-200">
              <Building className="w-4 h-4 mr-2" />
              All Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
