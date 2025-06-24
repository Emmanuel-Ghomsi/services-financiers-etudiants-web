import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/api-client';
import { toast } from 'sonner';
import type {
  SalaryAdvanceDTO,
  CreateSalaryAdvanceRequest,
  UpdateSalaryAdvanceRequest,
  UpdateSalaryAdvanceStatusRequest,
} from '@/types/salary-advance';

// Hook pour récupérer toutes les avances (nouveau endpoint)
export function useAllSalaryAdvances() {
  return useQuery<SalaryAdvanceDTO[]>({
    queryKey: ['salary-advances', 'all'],
    queryFn: () => apiRequest<SalaryAdvanceDTO[]>('/salary-advances'),
  });
}

// Hook pour récupérer l'historique des avances d'un employé
export function useSalaryAdvanceHistory(employeeId: string) {
  return useQuery<SalaryAdvanceDTO[]>({
    queryKey: ['salary-advances', 'history', employeeId],
    queryFn: () => apiRequest<SalaryAdvanceDTO[]>(`/salary-advances/history/${employeeId}`),
    enabled: !!employeeId,
  });
}

// Hook pour récupérer le total des avances approuvées pour un mois
export function useMonthlyApprovedAdvance(employeeId: string, year: string, month: string) {
  return useQuery<{ total: number }>({
    queryKey: ['salary-advances', 'approved-total', employeeId, year, month],
    queryFn: () => {
      const queryParams = new URLSearchParams({
        employeeId,
        year,
        month,
      });
      return apiRequest<{ total: number }>(`/salary-advances/approved-total?${queryParams}`);
    },
    enabled: !!employeeId && !!year && !!month,
  });
}

// Hook pour les mutations d'avances sur salaire (mis à jour)
export function useSalaryAdvanceMutations() {
  const queryClient = useQueryClient();

  const requestAdvance = useMutation({
    mutationFn: (data: CreateSalaryAdvanceRequest) =>
      apiRequest<SalaryAdvanceDTO>('/salary-advances', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success("Demande d'avance créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la demande: ${error.message}`);
    },
  });

  // Nouveau: Mutation pour modifier une avance complète
  const updateAdvance = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSalaryAdvanceRequest }) =>
      apiRequest<SalaryAdvanceDTO>(`/salary-advances/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success('Avance modifiée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la modification: ${error.message}`);
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSalaryAdvanceStatusRequest }) =>
      apiRequest<SalaryAdvanceDTO>(`/salary-advances/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success("Statut de l'avance mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    },
  });

  // Nouveau: Mutation pour supprimer une avance
  const deleteAdvance = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/salary-advances/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success('Avance supprimée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });

  return {
    requestAdvance,
    updateAdvance,
    updateStatus,
    deleteAdvance,
  };
}
