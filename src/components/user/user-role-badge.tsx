import { cn } from '@/lib/utils';

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUB_ADMIN' | 'ADVISOR' | string;

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const getRoleColor = (role: UserRole) => {
    switch (role.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SUB_ADMIN':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'ADVISOR':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role.toUpperCase()) {
      case 'SUPER_ADMIN':
        return "Contrôle Interne"
      case 'ADMIN':
        return "Conformité"
      case 'SUB_ADMIN':
        return 'Admin Délégué';
      case 'ADVISOR':
        return 'Conseiller';
      default:
        return role;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getRoleColor(role),
        className
      )}
    >
      {getRoleLabel(role)}
    </span>
  );
}
