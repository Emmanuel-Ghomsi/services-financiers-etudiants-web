import { cn } from '@/lib/utils';

type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING_DELETION' | string;

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const getStatusColor = (status: UserStatus) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING_DELETION':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'Actif';
      case 'INACTIVE':
        return 'Inactif';
      case 'BLOCKED':
        return 'Bloqué';
      case 'PENDING_DELETION':
        return 'Suppression en attente';
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
