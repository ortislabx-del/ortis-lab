import type { UserRole } from '@/types/recipe'

interface UserRoleBadgeProps {
  role: UserRole
}

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  admin: {
    label: 'Administrateur',
    className: 'bg-purple-100 text-purple-700 border border-purple-200',
  },
  chef: {
    label: 'Chef',
    className: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  staff: {
    label: 'Personnel',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = roleConfig[role]

  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
