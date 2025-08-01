export interface LeaveDTO {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  comment?: string;
  status: ValidationStatus;
  reviewedBy?: string;
  validatedByAdmin?: string;
  validatedBySuperAdmin?: string;
  rejectedReason?: string;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeavePaginationDTO {
  items: LeaveDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageLimit: number;
}

export interface CreateLeaveRequest {
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  comment?: string;
  userId: string;
}

export interface UpdateLeaveRequest {
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  comment?: string;
}

export interface LeaveListRequest {
  page: number;
  limit: number;
  filters?: {
    employeeUsername?: string;
    leaveType?: LeaveType;
    status?: ValidationStatus;
    startDate?: string;
    endDate?: string;
  };
}

export interface LeaveBalanceDTO {
  year: number;
  accruedDays: number;
  takenDays: number;
  remainingDays: number;
}

export interface LeaveBalanceRequest {
  employeeId: string;
  year: number;
}

export interface LeaveStatsDTO {
  totalApprovedDays: number;
  monthlyDaysTaken: Record<string, number>;
  byType: Record<string, number>;
}

export interface LeaveStatsRequest {
  year: number;
  employeeId?: string;
}

export interface AbsenceCalendarDTO {
  date: string;
  absences: {
    employeeId: string;
    employeeName: string;
    leaveType: string;
  }[];
}

export interface ValidateLeaveRequest {
  validatorId: string;
}

export interface RejectLeaveRequest {
  reason: string;
}

export interface UpdateLeaveStatusRequest {
  status: ValidationStatus;
}

export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  EXCEPTIONAL = 'EXCEPTIONAL',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  UNPAID = 'UNPAID',
}

export enum ValidationStatus {
  AWAITING_ADMIN_VALIDATION = 'AWAITING_ADMIN_VALIDATION',
  AWAITING_SUPERADMIN_VALIDATION = 'AWAITING_SUPERADMIN_VALIDATION',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}
