'use client'

import { User } from '@/types'
import { 
  getAvatarClasses, 
  getStatusIndicatorClasses, 
  getInitials, 
  getRoleIconClasses,
  getRoleIconBgClasses,
  AVATAR_SIZES 
} from '@/lib/avatarUtils'
import { Shield, Crown, User as UserIcon, Building } from 'lucide-react'

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showBorder?: boolean
  showStatus?: boolean
  showRole?: boolean
  className?: string
}

export default function UserAvatar({ 
  user, 
  size = 'md', 
  showBorder = false, 
  showStatus = false,
  showRole = false,
  className = ''
}: UserAvatarProps) {
  const initials = getInitials(user)
  const config = AVATAR_SIZES[size]

  // Get role icon based on user role
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return Shield
      case 'OWNER':
        return Crown
      case 'AGENT':
        return Building
      case 'USER':
      default:
        return UserIcon
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  return (
    <div className={`relative ${className}`}>
      <div className={`
        ${getAvatarClasses(user, { size, showBorder, showStatus })}
        ${user.profileImage && user.profileImage.trim() !== '' ? 'overflow-hidden' : ''}
      `}>
        {user.profileImage && user.profileImage.trim() !== '' ? (
          <img 
            src={user.profileImage} 
            alt={user.firstName || user.email}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<span class="text-white font-semibold ${config.text}">${initials}</span>`
              }
            }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      {/* Status indicator */}
      {showStatus && user.status && (
        <div className={getStatusIndicatorClasses(user.status)} />
      )}

      {/* Role indicator */}
      {showRole && (
        <div className={`
          absolute 
          -top-1 
          -right-1 
          w-4 h-4 
          ${getRoleIconBgClasses(user.role)} 
          rounded-full 
          flex 
          items-center 
          justify-center
          border-2 
          border-white
        `}>
          <RoleIcon className={`w-2.5 h-2.5 ${getRoleIconClasses(user.role)}`} />
        </div>
      )}
    </div>
  )
}
