import { SalaryPaymentMode, ValidationStatus } from '@/types/salary';

export const PAYMENT_MODE_LABELS: Record<SalaryPaymentMode, string> = {
  [SalaryPaymentMode.BANK_TRANSFER]: 'Virement bancaire',
  [SalaryPaymentMode.CASH]: 'Espèces',
  [SalaryPaymentMode.MOBILE_MONEY]: 'Mobile Money',
};

export const SALARY_ADVANCE_STATUS_LABELS: Record<ValidationStatus, string> = {
  [ValidationStatus.AWAITING_SUPERADMIN_VALIDATION]: 'En attente validation Contrôle Interne',
  [ValidationStatus.AWAITING_ADMIN_VALIDATION]: 'En attente validation Conformité',
  [ValidationStatus.VALIDATED]: 'Approuvée',
  [ValidationStatus.REJECTED]: 'Rejetée',
};

export const SALARY_ADVANCE_STATUS_COLORS: Record<ValidationStatus, string> = {
  [ValidationStatus.AWAITING_SUPERADMIN_VALIDATION]: 'bg-yellow-100 text-yellow-800',
  [ValidationStatus.AWAITING_ADMIN_VALIDATION]: 'bg-yellow-100 text-yellow-800',
  [ValidationStatus.VALIDATED]: 'bg-green-100 text-green-800',
  [ValidationStatus.REJECTED]: 'bg-red-100 text-red-800',
};

export const MONTHS = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
];

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i);
