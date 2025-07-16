'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiRequest } from '@/lib/api/api-client';

export interface DashboardSummaryDTO {
  totalSalaries: number;
  pendingAdvances: number;
  monthlyExpenses: number;
  activeLeaves: number;
}
export interface DashboardAdminSummaryDTO {
  totalSalaries: number;
  totalAdvances: number;
  totalExpenses: number;
}

export interface SalaryEvolutionDTO {
  month: string;
  total: number;
}

export interface ExpenseDistributionDTO {
  category: string;
  amount: number;
}

export function useDashboardSummary() {
  const { data: session } = useSession();

  return useQuery<DashboardSummaryDTO>({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<DashboardSummaryDTO>('/dashboard/summary');
    },
    enabled: !!session?.accessToken,
  });
}

export function useDashboardAdminSummary() {
  const { data: session } = useSession();

  return useQuery<DashboardAdminSummaryDTO>({
    queryKey: ['dashboard-admin-summary'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<DashboardAdminSummaryDTO>('/dashboard/summary/admin');
    },
    enabled: !!session?.accessToken,
  });
}

export function useSalaryEvolution(year: string) {
  const { data: session } = useSession();

  return useQuery<SalaryEvolutionDTO[]>({
    queryKey: ['salary-evolution'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<SalaryEvolutionDTO[]>(`/dashboard/salary-evolution?year=${year}`);
    },
    enabled: !!session?.accessToken,
  });
}

export function useExpenseDistribution({ year, month }: { year: string; month: string }) {
  const { data: session } = useSession();

  return useQuery<ExpenseDistributionDTO[]>({
    queryKey: ['expense-distribution'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<ExpenseDistributionDTO[]>(
        `/dashboard/expense-distribution?year=${year}&month=${month}`
      );
    },
    enabled: !!session?.accessToken,
  });
}
