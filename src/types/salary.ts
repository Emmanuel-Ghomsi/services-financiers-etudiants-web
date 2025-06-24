export interface SalaryDTO {
  id: string;
  employeeId: string;
  grossSalary: number;
  deductions: number;
  advances: number;
  netSalary: number;
  paymentMode: string;
  paymentDate: string;
  payslipUrl?: string;
  year: string;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPaginationDTO {
  items: SalaryDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageLimit: number;
}

export interface CreateSalaryRequest {
  employeeId: string;
  grossSalary: number;
  deductions?: number;
  advances?: number;
  paymentMode: SalaryPaymentMode;
  paymentDate: Date;
}

export interface UpdateSalaryRequest {
  grossSalary?: number;
  deductions?: number;
  advances?: number;
  paymentMode?: SalaryPaymentMode;
  paymentDate?: Date;
  payslipUrl?: string;
}

export interface SalaryListRequest {
  page: number;
  limit: number;
}

export interface SalaryPeriodFilterRequest {
  month: number;
  year: number;
}

export interface SalaryPeriodPaginatedRequest {
  month: number;
  year: number;
  page: number;
  limit: number;
}

export interface SalaryPeriodDTO {
  employeeId: string;
  grossSalary: number;
  deductions: number;
  advances: number;
  netSalary: number;
  paymentDate: string;
}

export interface SalaryPeriodPaginationDTO {
  items: SalaryPeriodDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageLimit: number;
}

export interface SalaryPdfDataDTO {
  employeeId: string;
  grossSalary: number;
  deductions: number;
  advances: number;
  netSalary: number;
  paymentDate: string;
  paymentMode: string;
  createdAt: string;
}

export enum SalaryPaymentMode {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
}
