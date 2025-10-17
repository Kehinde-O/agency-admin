// Utility functions for generating consistent color-coded avatars

export interface AvatarConfig {
  size: 'sm' | 'md' | 'lg' | 'xl'
  showBorder: boolean
  showStatus: boolean
}

// Predefined color palette for consistent avatar colors
export const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500', 
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500'
] as const

// Size configurations for different avatar sizes
export const AVATAR_SIZES = {
  sm: { container: 'w-8 h-8', text: 'text-xs', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5' },
  lg: { container: 'w-12 h-12', text: 'text-base', icon: 'w-6 h-6' },
  xl: { container: 'w-16 h-16', text: 'text-lg', icon: 'w-8 h-8' }
} as const

/**
 * Generate a consistent color for a user based on their name or email
 */
export function getAvatarColor(user: { firstName?: string; lastName?: string; name?: string; email: string }): string {
  const name = user.firstName || user.name || user.email || 'User'
  
  // Use a simple hash function to get consistent colors
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/**
 * Generate initials from user data
 */
export function getInitials(user: { firstName?: string; lastName?: string; name?: string; email: string }): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase()
  }
  if (user.name) {
    const nameParts = user.name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    }
    return nameParts[0].charAt(0).toUpperCase()
  }
  return user.email.charAt(0).toUpperCase()
}

/**
 * Get status indicator color based on user status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500'
    case 'INACTIVE':
      return 'bg-yellow-500'
    case 'SUSPENDED':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

/**
 * Generate avatar classes based on configuration
 */
export function getAvatarClasses(
  user: { firstName?: string; lastName?: string; name?: string; email: string; status?: string },
  config: AvatarConfig
): string {
  const sizeConfig = AVATAR_SIZES[config.size]
  const avatarColor = getAvatarColor(user)
  
  return `
    ${sizeConfig.container} 
    ${avatarColor} 
    rounded-full 
    flex 
    items-center 
    justify-center 
    text-white 
    font-semibold 
    ${sizeConfig.text}
    ${config.showBorder ? 'ring-2 ring-white shadow-lg' : ''}
  `.trim()
}

/**
 * Generate status indicator classes
 */
export function getStatusIndicatorClasses(status: string): string {
  const statusColor = getStatusColor(status)
  return `
    absolute 
    -bottom-0.5 
    -right-0.5 
    w-3 h-3 
    ${statusColor} 
    rounded-full 
    border-2 
    border-white
  `.trim()
}

/**
 * Get role-based icon classes for avatar overlays
 */
export function getRoleIconClasses(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'text-purple-600'
    case 'OWNER':
      return 'text-indigo-600'
    case 'AGENT':
      return 'text-blue-600'
    case 'USER':
    default:
      return 'text-gray-600'
  }
}

/**
 * Get role-based background color for icon overlays
 */
export function getRoleIconBgClasses(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100'
    case 'OWNER':
      return 'bg-indigo-100'
    case 'AGENT':
      return 'bg-blue-100'
    case 'USER':
    default:
      return 'bg-gray-100'
  }
}
