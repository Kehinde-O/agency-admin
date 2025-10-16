// Error handling utilities for the admin app

export interface SafeStringOptions {
  defaultValue?: string
  maxLength?: number
}

/**
 * Safely extracts the first character from a string
 * @param str - The string to extract character from
 * @param options - Configuration options
 * @returns The first character or default value
 */
export function safeCharAt(str: any, options: SafeStringOptions = {}): string {
  const { defaultValue = 'U', maxLength } = options
  
  if (!str || typeof str !== 'string') {
    return defaultValue
  }
  
  const trimmedStr = str.trim()
  if (trimmedStr.length === 0) {
    return defaultValue
  }
  
  const result = trimmedStr.charAt(0)
  return maxLength && result.length > maxLength ? result.substring(0, maxLength) : result
}

/**
 * Safely capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @param options - Configuration options
 * @returns Capitalized string or default value
 */
export function safeCapitalize(str: any, options: SafeStringOptions = {}): string {
  const { defaultValue = 'Unknown' } = options
  
  if (!str || typeof str !== 'string') {
    return defaultValue
  }
  
  const trimmedStr = str.trim()
  if (trimmedStr.length === 0) {
    return defaultValue
  }
  
  return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1)
}

/**
 * Safely formats a user's display name
 * @param user - User object with firstName and lastName
 * @returns Formatted name or fallback
 */
export function safeUserDisplayName(user: any): string {
  if (!user) return 'Unknown User'
  
  const firstName = user.firstName?.trim() || ''
  const lastName = user.lastName?.trim() || ''
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  } else if (firstName) {
    return firstName
  } else if (lastName) {
    return lastName
  } else if (user.name?.trim()) {
    return user.name.trim()
  } else if (user.email?.trim()) {
    return user.email.trim()
  }
  
  return 'Unknown User'
}

/**
 * Safely gets user initials
 * @param user - User object
 * @returns User initials or default
 */
export function safeUserInitials(user: any): string {
  if (!user) return 'U'
  
  const firstName = user.firstName?.trim()
  const lastName = user.lastName?.trim()
  
  if (firstName && lastName) {
    return `${safeCharAt(firstName)}${safeCharAt(lastName)}`
  } else if (firstName) {
    return safeCharAt(firstName)
  } else if (lastName) {
    return safeCharAt(lastName)
  } else if (user.name?.trim()) {
    return safeCharAt(user.name.trim())
  }
  
  return 'U'
}

/**
 * Validates and sanitizes property data
 * @param property - Property object to validate
 * @returns Sanitized property object
 */
export function sanitizeProperty(property: any): any {
  if (!property) return null
  
  return {
    ...property,
    id: property.id || '',
    title: property.title || 'Untitled Property',
    description: property.description || '',
    price: property.price ? (typeof property.price === 'number' ? property.price : parseFloat(property.price.toString())) : 0,
    currency: property.currency || 'NGN',
    maintenanceFee: property.maintenanceFee ? (typeof property.maintenanceFee === 'number' ? property.maintenanceFee : parseFloat(property.maintenanceFee.toString())) : null,
    securityDeposit: property.securityDeposit ? (typeof property.securityDeposit === 'number' ? property.securityDeposit : parseFloat(property.securityDeposit.toString())) : null,
    size: property.size ? (typeof property.size === 'number' ? property.size : parseFloat(property.size.toString())) : null,
    location: property.location || '',
    type: property.propertyType || property.type || 'unknown',
    listingType: property.listingType || 'sale',
    status: property.status || 'pending',
    user: property.user ? {
      ...property.user,
      id: property.user.id || '',
      firstName: property.user.firstName || '',
      lastName: property.user.lastName || '',
      email: property.user.email || '',
      isVerified: Boolean(property.user.isVerified)
    } : null,
    owner: property.owner ? {
      ...property.owner,
      name: property.owner.name || ''
    } : null
  }
}

/**
 * Validates and sanitizes log data
 * @param log - Log object to validate
 * @returns Sanitized log object
 */
export function sanitizeLog(log: any): any {
  if (!log) return null
  
  return {
    ...log,
    id: log.id || '',
    action: log.action || 'unknown',
    propertyId: log.propertyId || '',
    adminName: log.adminName || 'Unknown Admin',
    timestamp: log.timestamp || new Date().toISOString(),
    reason: log.reason || '',
    metadata: log.metadata || {}
  }
}
