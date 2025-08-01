export enum ValidationStatus {
  AWAITING_ADMIN_VALIDATION = 'AWAITING_ADMIN_VALIDATION',
  AWAITING_SUPERADMIN_VALIDATION = 'AWAITING_SUPERADMIN_VALIDATION',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

export interface ValidationRequest {
  validatorId: string;
}

export interface RejectRequest {
  reason: string;
}

export interface UpdateStatusRequest {
  status: ValidationStatus;
}
