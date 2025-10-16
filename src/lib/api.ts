// API service for admin app
import { getAdminToken, updateAdminToken } from './auth'
import { sanitizeProperty } from './error-handler'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('NEXT_PUBLIC_API_URL environment variable is not set. Using default backend URL.')
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

class ApiService {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Initialize token from localStorage
    this.token = getAdminToken()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Get fresh token from localStorage for each request
    const currentToken = getAdminToken()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // Try to refresh token or redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminAuth')
          localStorage.removeItem('adminUser')
          localStorage.removeItem('adminRefreshToken')
          window.location.href = '/'
        }
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.success && response.data.token) {
      this.token = response.data.token
      updateAdminToken(response.data.token)
    }
    
    return response
  }

  // Property methods
  async getPendingProperties(page = 1, limit = 20, status = 'all') {
    let endpoint = `/admin/properties/pending?page=${page}&limit=${limit}`
    
    // If status is not 'all', we need to use the general properties endpoint with status filter
    if (status !== 'all' && status !== 'pending') {
      endpoint = `/properties?page=${page}&limit=${limit}&status=${status.toUpperCase()}`
    }
    
    const response = await this.request<{ properties: any[] }>(endpoint)
    
    // Validate and sanitize property data
    if (response.success && response.data.properties) {
      response.data.properties = response.data.properties.map(sanitizeProperty)
    }
    
    return response
  }

  async getAllProperties(page = 1, limit = 20, status?: string, type?: string) {
    let endpoint = `/admin/properties?page=${page}&limit=${limit}`
    
    // Add query parameters if provided
    const params = new URLSearchParams()
    if (status && status !== 'all') {
      params.append('status', status.toUpperCase())
    }
    if (type && type !== 'all') {
      params.append('type', type.toUpperCase())
    }
    
    if (params.toString()) {
      endpoint += `&${params.toString()}`
    }
    
    const response = await this.request<{ properties: any[] }>(endpoint)
    
    // Validate and sanitize property data
    if (response.success && response.data.properties) {
      response.data.properties = response.data.properties.map(sanitizeProperty)
    }
    
    return response
  }

  async getPropertyById(id: string) {
    const response = await this.request<{ property: any }>(`/properties/${id}`)
    
    // Sanitize property data
    if (response.success && response.data.property) {
      response.data.property = sanitizeProperty(response.data.property)
    }
    
    return response
  }

  async approveProperty(id: string, reason?: string) {
    return this.request<{ property: any }>(`/admin/properties/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  }

  async rejectProperty(id: string, reason: string) {
    return this.request<{ property: any }>(`/admin/properties/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  }

  async pullDownProperty(id: string, reason: string) {
    return this.request<{ property: any }>(`/admin/properties/${id}/pull-down`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  }

  async reactivateProperty(id: string, reason?: string) {
    return this.request<{ property: any }>(`/admin/properties/${id}/reactivate`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  }

  async getSimilarProperties(propertyId: string, limit = 8) {
    return this.request<{ properties: any[] }>(`/properties/${propertyId}/similar?limit=${limit}`)
  }

  async getPropertyBookings(propertyId: string) {
    return this.request<{ bookings: any[] }>(`/properties/${propertyId}/bookings`)
  }

  async addAdminNote(propertyId: string, note: string) {
    return this.request<{ note: any }>(`/admin/properties/${propertyId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    })
  }

  async flagProperty(propertyId: string, reason: string) {
    return this.request<{ property: any }>(`/admin/properties/${propertyId}/flag`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    })
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request<{
      totalUsers: number
      totalProperties: number
      totalRevenue: number
      activeListings: number
      userGrowth: number
      propertyGrowth: number
      revenueGrowth: number
      listingGrowth: number
    }>('/admin/dashboard/stats')
  }

  // User management
  async getUsers(page = 1, limit = 20) {
    return this.request<{ users: any[] }>(`/admin/users?page=${page}&limit=${limit}`)
  }

  async getUserById(id: string) {
    return this.request<{ user: any }>(`/admin/users/${id}`)
  }

  async updateUserStatus(id: string, status: string) {
    return this.request<{ user: any }>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // Activity logs
  async getActivityLogs(page = 1, limit = 20) {
    return this.request<{ logs: any[] }>(`/admin/activity-logs?page=${page}&limit=${limit}`)
  }

  // Logout
  logout() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminUser')
      localStorage.removeItem('adminRefreshToken')
    }
  }
}

export const apiService = new ApiService(API_BASE_URL)
export default apiService
