export enum ClientFileStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  AWAITING_ADMIN_VALIDATION = 'AWAITING_ADMIN_VALIDATION',
  AWAITING_SUPERADMIN_VALIDATION = 'AWAITING_SUPERADMIN_VALIDATION',
  REJECTED = 'REJECTED',
  BEING_MODIFIED = 'BEING_MODIFIED',
  VALIDATED = 'VALIDATED',
}

export const ClientFileStatusLabels: Record<ClientFileStatus, string> = {
  [ClientFileStatus.IN_PROGRESS]: 'En cours',
  [ClientFileStatus.AWAITING_ADMIN_VALIDATION]: 'En attente de validation (Conformité)',
  [ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION]: 'En attente de validation (Contrôle Interne)',
  [ClientFileStatus.REJECTED]: 'Rejetée',
  [ClientFileStatus.BEING_MODIFIED]: 'En cours de modification',
  [ClientFileStatus.VALIDATED]: 'Validée',
};

export const ClientFileStatusColors: Record<ClientFileStatus, string> = {
  [ClientFileStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-800 border-amber-200',
  [ClientFileStatus.AWAITING_ADMIN_VALIDATION]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION]:
    'bg-purple-100 text-purple-800 border-purple-200',
  [ClientFileStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
  [ClientFileStatus.BEING_MODIFIED]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ClientFileStatus.VALIDATED]: 'bg-green-100 text-green-800 border-green-200',
};
