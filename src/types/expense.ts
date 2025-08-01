export interface ExpenseDTO {
  id: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  group: ExpenseCategoryGroup;
  description?: string;
  employeeId: string;
  projectId?: string;
  fileUrl?: string;
  status: ValidationStatus;
  validatedByAdmin?: string;
  validatedBySuperAdmin?: string;
  rejectedReason?: string;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  amount: number;
  date: Date;
  category: ExpenseCategory;
  group: ExpenseCategoryGroup;
  description?: string;
  employeeId: string;
  projectId?: string;
  fileUrl?: string;
  userId: string;
}

export interface UpdateExpenseRequest {
  amount?: number;
  date?: Date;
  category?: ExpenseCategory;
  group?: ExpenseCategoryGroup;
  description?: string;
  employeeId?: string;
  projectId?: string;
  fileUrl?: string;
}

export interface ExpenseListRequest {
  page: number;
  limit: number;
}

export interface ExpenseFilterRequest {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
  group?: ExpenseCategoryGroup;
  employeeId?: string;
  projectId?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: ValidationStatus;
  page?: number;
  limit?: number;
}

export interface ExpensePaginationDTO {
  items: ExpenseDTO[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ExpenseStatsDTO {
  totalYear: number;
  monthlyTotals: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface ExpenseStatsRequest {
  year: number;
  month?: number;
}

export enum ValidationStatus {
  AWAITING_ADMIN_VALIDATION = 'AWAITING_ADMIN_VALIDATION',
  AWAITING_SUPERADMIN_VALIDATION = 'AWAITING_SUPERADMIN_VALIDATION',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

export enum ExpenseCategoryGroup {
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  MOBILITY = 'MOBILITY',
  MARKETING = 'MARKETING',
  IT = 'IT',
  OPERATIONS = 'OPERATIONS',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER',
}

export enum ExpenseCategory {
  // Administratives
  OFFICE_RENT = 'OFFICE_RENT',
  OFFICE_CHARGES = 'OFFICE_CHARGES',
  INTERNET = 'INTERNET',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  SOFTWARE_SUBSCRIPTIONS = 'SOFTWARE_SUBSCRIPTIONS',
  POSTAL_FEES = 'POSTAL_FEES',
  INSURANCE = 'INSURANCE',

  // Déplacements et mobilité
  LOCAL_TRANSPORT = 'LOCAL_TRANSPORT',
  MILEAGE_REIMBURSEMENT = 'MILEAGE_REIMBURSEMENT',
  FLIGHTS = 'FLIGHTS',
  ACCOMMODATION = 'ACCOMMODATION',
  PER_DIEM = 'PER_DIEM',
  CAR_RENTAL = 'CAR_RENTAL',
  MISSION_FEES = 'MISSION_FEES',

  // Marketing & communication
  ONLINE_ADS = 'ONLINE_ADS',
  DESIGN = 'DESIGN',
  PRINTING = 'PRINTING',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  PARTNERSHIPS = 'PARTNERSHIPS',
  WEBSITE = 'WEBSITE',

  // IT et technologie
  SOFTWARE_DEV = 'SOFTWARE_DEV',
  SERVER_HOSTING = 'SERVER_HOSTING',
  CYBERSECURITY = 'CYBERSECURITY',
  HARDWARE_PURCHASE = 'HARDWARE_PURCHASE',
  SOFTWARE_LICENSES = 'SOFTWARE_LICENSES',
  TECH_EQUIPMENT = 'TECH_EQUIPMENT',

  // Opérations / services
  BANK_FEES = 'BANK_FEES',
  FREELANCE_FEES = 'FREELANCE_FEES',
  EXTERNAL_MISSIONS = 'EXTERNAL_MISSIONS',
  CERTIFICATION_FEES = 'CERTIFICATION_FEES',

  // Légal & conformité
  LEGAL_FEES = 'LEGAL_FEES',
  ADMIN_REGISTRATION = 'ADMIN_REGISTRATION',
  LICENSE_RENEWAL = 'LICENSE_RENEWAL',
  COMPLIANCE_FEES = 'COMPLIANCE_FEES',

  // Autres / Divers
  TAXES = 'TAXES',
  PENALTIES = 'PENALTIES',
  DONATIONS = 'DONATIONS',
  LOSSES = 'LOSSES',
  ONE_TIME_PURCHASE = 'ONE_TIME_PURCHASE',
}
