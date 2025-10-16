// Type definitions for the admin dashboard

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  role: 'user' | 'agent' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  phone?: string
  profileImage?: string
  isVerified?: boolean
  rating?: number | string
  listingsCount?: number
  isAgent?: boolean
  licenseNumber?: string
  experience?: number
  companyName?: string
  createdAt: string
  lastLogin?: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency?: string
  location: string
  address?: string
  city?: string
  state?: string
  type: 'apartment' | 'house' | 'commercial' | 'land' | 'condo' | 'townhouse'
  propertyType?: string
  listingType?: 'sale' | 'rent' | 'lease'
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'DRAFT' | 'INACTIVE' | 'SOLD' | 'RENTED'
  images: string[]
  featuredImage?: string
  videos?: string[]
  bedrooms?: number
  bathrooms?: number
  size?: number
  parking?: number
  floor?: number
  totalFloors?: number
  yearBuilt?: number
  isFurnished?: boolean
  hasParking?: boolean
  isPetFriendly?: boolean
  amenities?: string[]
  features?: string[]
  condition?: string
  facing?: string
  availabilityStatus?: string
  availableFrom?: string
  maintenanceFee?: number
  securityDeposit?: number
  isPriceNegotiable?: boolean
  includesUtilities?: boolean
  rentTerm?: string
  latitude?: number
  longitude?: number
  landmark?: string
  country?: string
  zipCode?: string
  owner?: User
  user?: User
  agent?: User
  agentId?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
  // Enhanced fields from backend
  statistics?: {
    totalViews: number
    totalFavorites: number
    totalInquiries: number
    averageRating: number
    totalReviews: number
  }
  approvalHistory?: Array<{
    id: string
    action: string
    reason?: string
    previousStatus: string
    newStatus: string
    createdAt: string
    admin: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
  }>
  recentActivity?: Array<{
    id: string
    type: string
    createdAt: string
    metadata?: any
  }>
  recentViews?: Array<{
    id: string
    createdAt: string
    user?: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
  }>
  recentFavorites?: Array<{
    id: string
    createdAt: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
  }>
  recentReviews?: Array<{
    id: string
    rating: number
    comment: string
    createdAt: string
    user: {
      id: string
      firstName: string
      lastName: string
      profileImage?: string
    }
  }>
  approvalStatus?: {
    isApproved: boolean
    isPending: boolean
    isRejected: boolean
    isDraft: boolean
    isInactive: boolean
    canApprove: boolean
    canReject: boolean
    canPullDown: boolean
    canReactivate: boolean
  }
}

export interface DashboardStats {
  totalUsers: number
  totalProperties: number
  totalRevenue: number
  activeListings: number
  userGrowth: number
  propertyGrowth: number
  revenueGrowth: number
  listingGrowth: number
}

export interface ActivityLog {
  id: string
  action: string
  user: string
  timestamp: string
  details?: string
}

export interface AdminSettings {
  siteName: string
  maintenanceMode: boolean
  allowRegistrations: boolean
  emailNotifications: boolean
  maxFileSize: number
  allowedFileTypes: string[]
}
