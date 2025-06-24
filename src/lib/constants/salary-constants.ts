import { SalaryPaymentMode } from '@/types/salary';
import { SalaryAdvanceStatus } from '@/types/salary-advance';

export const PAYMENT_MODE_LABELS: Record<SalaryPaymentMode, string> = {
  [SalaryPaymentMode.BANK_TRANSFER]: 'Virement bancaire',
  [SalaryPaymentMode.CASH]: 'Espèces',
  [SalaryPaymentMode.MOBILE_MONEY]: 'Mobile Money',
};

export const SALARY_ADVANCE_STATUS_LABELS: Record<SalaryAdvanceStatus, string> = {
  [SalaryAdvanceStatus.PENDING]: 'En attente',
  [SalaryAdvanceStatus.APPROVED]: 'Approuvée',
  [SalaryAdvanceStatus.REJECTED]: 'Rejetée',
};

export const SALARY_ADVANCE_STATUS_COLORS: Record<SalaryAdvanceStatus, string> = {
  [SalaryAdvanceStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [SalaryAdvanceStatus.APPROVED]: 'bg-green-100 text-green-800',
  [SalaryAdvanceStatus.REJECTED]: 'bg-red-100 text-red-800',
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
