'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, Activity, Shield, UserCheck, UserX, Home, BookOpen, Star, MapPin, Building } from 'lucide-react'
import { apiService } from '@/lib/api'
import { User } from '@/types'
import UserAvatar from '@/components/users/UserAvatar'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchUserDetails(params.id as string)
    }
  }, [params.id])

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching user details for ID:', userId)
      const response = await apiService.getUserById(userId)
      console.log('User details response:', response)
      
      if (response.success) {
        setUser(response.data.user || response.data)
      } else {
        setError(response.message || 'Failed to fetch user details')
      }
    } catch (err) {
      console.error('Error fetching user details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action: string, data?: any) => {
    if (!user) return

    try {
      setActionLoading(true)
      
      const response = await apiService.updateUser(user.id, { [action]: data })
      
      if (response.success) {
        // Refresh user data
        await fetchUserDetails(user.id)
      } else {
        setError('Failed to update user')
      }
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100'
      case 'INACTIVE':
        return 'text-yellow-600 bg-yellow-100'
      case 'SUSPENDED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'text-purple-600 bg-purple-100'
      case 'OWNER':
        return 'text-indigo-600 bg-indigo-100'
      case 'AGENT':
        return 'text-blue-600 bg-blue-100'
      case 'USER':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner 
          message="Loading user details..." 
          size="lg"
          className="text-center"
        />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <UserX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">User Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'The requested user could not be found.'}</p>
          <button
            onClick={() => router.push('/users')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/users')}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserAvatar 
                user={user} 
                size="xl" 
                showStatus={true}
                showRole={true}
                showBorder={true}
                className="mr-6"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </h1>
                <p className="text-slate-600 text-lg">{user.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  {user.isEmailVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <UserCheck className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-slate-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium text-slate-900">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <p className="font-medium text-slate-900">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-600">Member Since</p>
                    <p className="font-medium text-slate-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-slate-400 mr-3" />
                  <div>
                    <p className="text-sm text-slate-600">Last Active</p>
                    <p className="font-medium text-slate-900">
                      {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Properties */}
            {user.properties && user.properties.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <Home className="w-5 h-5 text-slate-600 mr-2" />
                  Properties ({user._count?.properties || 0})
                </h3>
                <div className="space-y-4">
                  {user.properties.slice(0, 5).map((property: any) => (
                    <div key={property.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{property.title}</h4>
                        <p className="text-sm text-slate-600">
                          Created {formatDate(property.createdAt)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  ))}
                  {user.properties.length > 5 && (
                    <p className="text-sm text-slate-600 text-center">
                      And {user.properties.length - 5} more properties...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* User Bookings */}
            {user.bookings && user.bookings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 text-slate-600 mr-2" />
                  Recent Bookings ({user._count?.bookings || 0})
                </h3>
                <div className="space-y-4">
                  {user.bookings.slice(0, 5).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{booking.property?.title}</h4>
                        <p className="text-sm text-slate-600">
                          Booked {formatDate(booking.createdAt)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                  {user.bookings.length > 5 && (
                    <p className="text-sm text-slate-600 text-center">
                      And {user.bookings.length - 5} more bookings...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Role</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 text-slate-400 mr-3" />
                    <div>
                      <p className="text-sm text-slate-600">Status</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  {user.isEmailVerified ? (
                    <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <UserX className="w-5 h-5 text-red-600 mr-3" />
                  )}
                  <div>
                    <p className="text-sm text-slate-600">Email Verification</p>
                    <p className="font-medium text-slate-900">
                      {user.isEmailVerified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {user.role !== 'ADMIN' && user.role !== 'OWNER' && (
                  <>
                    <button
                      onClick={() => handleUserAction('status', { status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
                      disabled={actionLoading}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        user.status === 'ACTIVE' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      {user.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                    </button>

                    <button
                      onClick={() => handleUserAction('role', { role: user.role === 'USER' ? 'AGENT' : 'USER' })}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                      {user.role === 'USER' ? 'Make Agent' : 'Make User'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {user.rating && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Rating</h3>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-900">{user.rating}</span>
                  <span className="text-slate-600 ml-2">/ 5.0</span>
                </div>
              </div>
            )}

            {user.experience && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Experience</h3>
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="text-slate-900">{user.experience} years</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
