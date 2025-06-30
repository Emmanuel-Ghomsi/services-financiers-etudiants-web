export interface SalaryAdvanceDTO {
  id: string;
  amount: number;
  reason: string;
  requestedDate: string;
  status: ValidationStatus;
  employeeId: string;
  validatedByAdmin?: string;
  validatedBySuperAdmin?: string;
  rejectedReason?: string;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalaryAdvanceRequest {
  amount: number;
  reason: string;
  requestedDate: Date;
  employeeId: string;
  userId: string;
}

export interface UpdateSalaryAdvanceRequest {
  amount?: number;
  reason?: string;
  requestedDate?: string;
  status?: ValidationStatus;
  employeeId?: string;
}

export interface UpdateSalaryAdvanceStatusRequest {
  status: ValidationStatus;
}

export enum ValidationStatus {
  AWAITING_ADMIN_VALIDATION = 'AWAITING_ADMIN_VALIDATION',
  AWAITING_SUPERADMIN_VALIDATION = 'AWAITING_SUPERADMIN_VALIDATION',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

export interface DashboardSummaryDTO {
  totalSalaries: number;
  pendingAdvances: number;
  monthlyExpenses: number;
  activeLeaves: number;
}

export interface SalaryEvolutionDTO {
  month: string;
  total: number;
}

export interface ExpenseDistributionDTO {
  category: string;
  amount: number;
}
