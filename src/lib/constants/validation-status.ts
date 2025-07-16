import { ValidationStatus } from '@/types/validation';

export const VALIDATION_STATUS_LABELS: Record<ValidationStatus, string> = {
  [ValidationStatus.AWAITING_ADMIN_VALIDATION]: 'En attente validation Conformité',
  [ValidationStatus.AWAITING_SUPERADMIN_VALIDATION]: 'En attente validation Contrôle Interne',
  [ValidationStatus.VALIDATED]: 'Validé',
  [ValidationStatus.REJECTED]: 'Rejeté',
};

export const VALIDATION_STATUS_COLORS: Record<ValidationStatus, string> = {
  [ValidationStatus.AWAITING_ADMIN_VALIDATION]: 'bg-yellow-100 text-yellow-800',
  [ValidationStatus.AWAITING_SUPERADMIN_VALIDATION]: 'bg-blue-100 text-blue-800',
  [ValidationStatus.VALIDATED]: 'bg-green-100 text-green-800',
  [ValidationStatus.REJECTED]: 'bg-red-100 text-red-800',
};

export const VALIDATION_STATUS_ICONS: Record<ValidationStatus, string> = {
  [ValidationStatus.AWAITING_ADMIN_VALIDATION]: '⏳',
  [ValidationStatus.AWAITING_SUPERADMIN_VALIDATION]: '🔍',
  [ValidationStatus.VALIDATED]: '✅',
  [ValidationStatus.REJECTED]: '❌',
};
