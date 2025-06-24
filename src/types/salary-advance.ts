export interface SalaryAdvanceDTO {
  id: string;
  amount: number;
  reason: string;
  requestedDate: string;
  status: SalaryAdvanceStatus;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalaryAdvanceRequest {
  amount: number;
  reason: string;
  requestedDate: Date;
  employeeId: string;
}

export interface UpdateSalaryAdvanceRequest {
  amount?: number;
  reason?: string;
  requestedDate?: string; // String pour l'API
  status?: SalaryAdvanceStatus;
  employeeId?: string; // Optionnel pour la modification
}

export interface UpdateSalaryAdvanceStatusRequest {
  status: SalaryAdvanceStatus;
}

export enum SalaryAdvanceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
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
