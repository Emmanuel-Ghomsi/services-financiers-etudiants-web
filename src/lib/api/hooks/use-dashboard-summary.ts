import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/api-client';
import type {
  DashboardSummaryDTO,
  SalaryEvolutionDTO,
  ExpenseDistributionDTO,
} from '@/types/salary-advance';

// Hook pour récupérer le résumé du dashboard
export function useDashboardSummary() {
  return useQuery<DashboardSummaryDTO>({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiRequest<DashboardSummaryDTO>('/dashboard/summary'),
  });
}

// Hook pour récupérer l'évolution des salaires
export function useSalaryEvolution(year: string) {
  return useQuery<SalaryEvolutionDTO[]>({
    queryKey: ['dashboard', 'salary-evolution', year],
    queryFn: () => {
      const queryParams = new URLSearchParams({ year });
      return apiRequest<SalaryEvolutionDTO[]>(`/dashboard/salary-evolution?${queryParams}`);
    },
    enabled: !!year,
  });
}

// Hook pour récupérer la distribution des dépenses
export function useExpenseDistribution(year: string, month?: string) {
  return useQuery<ExpenseDistributionDTO[]>({
    queryKey: ['dashboard', 'expense-distribution', year, month],
    queryFn: () => {
      const queryParams = new URLSearchParams({ year });
      if (month) queryParams.append('month', month);
      return apiRequest<ExpenseDistributionDTO[]>(`/dashboard/expense-distribution?${queryParams}`);
    },
    enabled: !!year,
  });
}
