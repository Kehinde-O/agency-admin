'use client'

import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Booking {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  bookingType: string
  scheduledDate: string
  scheduledTime: string
  status: string
  notes?: string
  specialRequests?: string
  numberOfPeople: number
  createdAt: string
}

interface PropertyBookingsListProps {
  bookings: Booking[]
  propertyTitle: string
}

export default function PropertyBookingsList({ bookings, propertyTitle }: PropertyBookingsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getBookingTypeColor = (type: string) => {
    switch (type) {
      case 'VIEWING':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'INSPECTION':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'MEETING':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Property Bookings</h3>
              <p className="text-sm text-slate-600">Scheduled viewings and inspections</p>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">No Bookings Yet</h4>
            <p className="text-slate-600">This property hasn't received any booking requests.</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Property Bookings</h3>
              <p className="text-sm text-slate-600">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} scheduled</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{bookings.length}</div>
            <div className="text-sm text-slate-600">Total Bookings</div>
          </div>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {booking.user.firstName} {booking.user.lastName}
                    </h4>
                    <p className="text-sm text-slate-600">{booking.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${getBookingTypeColor(booking.bookingType)}`}>
                    {booking.bookingType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-slate-600">Date</div>
                    <div className="text-slate-900 font-semibold">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-4 h-4 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-slate-600">Time</div>
                    <div className="text-slate-900 font-semibold">{booking.scheduledTime}</div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <User className="w-4 h-4 text-purple-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-slate-600">People</div>
                    <div className="text-slate-900 font-semibold">{booking.numberOfPeople}</div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-600 mb-1">Notes</div>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{booking.notes}</p>
                </div>
              )}

              {booking.specialRequests && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-600 mb-1">Special Requests</div>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{booking.specialRequests}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-4">
                  {booking.user.phone && (
                    <button className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </button>
                  )}
                  <button className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </button>
                </div>
                <div className="text-sm text-slate-500">
                  Booked {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
