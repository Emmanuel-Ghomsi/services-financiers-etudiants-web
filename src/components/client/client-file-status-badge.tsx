import { cn } from '@/lib/utils';
import { ClientFileStatus } from '@/lib/constants/client-file-status';

interface ClientFileStatusBadgeProps {
  reject?: string | null;
  status: string;
  className?: string;
}

export function ClientFileStatusBadge({ reject, status, className }: ClientFileStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case ClientFileStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ClientFileStatus.AWAITING_ADMIN_VALIDATION:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case ClientFileStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case ClientFileStatus.BEING_MODIFIED:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case ClientFileStatus.VALIDATED:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case ClientFileStatus.IN_PROGRESS:
        return 'En cours';
      case ClientFileStatus.AWAITING_ADMIN_VALIDATION:
        return 'En attente (Admin)';
      case ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION:
        return 'En attente (Super Admin)';
      case ClientFileStatus.REJECTED:
        return 'Rejetée';
      case ClientFileStatus.BEING_MODIFIED:
        return 'En modification';
      case ClientFileStatus.VALIDATED:
        return 'Validée';
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
      {getStatusLabel(status)} {status == ClientFileStatus.REJECTED ? ' : ' + reject : ''}
    </span>
  );
}
