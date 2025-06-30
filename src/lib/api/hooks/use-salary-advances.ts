import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import type {
  SalaryAdvanceDTO,
  CreateSalaryAdvanceRequest,
  UpdateSalaryAdvanceRequest,
  UpdateSalaryAdvanceStatusRequest,
} from '@/types/salary-advance';

export function useAllSalaryAdvances() {
  return useQuery<SalaryAdvanceDTO[]>({
    queryKey: ['salary-advances', 'all'],
    queryFn: () => apiRequest<SalaryAdvanceDTO[]>('/salary-advances'),
  });
}

export function useSalaryAdvanceHistory(employeeId: string) {
  return useQuery<SalaryAdvanceDTO[]>({
    queryKey: ['salary-advances', 'history', employeeId],
    queryFn: () => apiRequest<SalaryAdvanceDTO[]>(`/salary-advances/history/${employeeId}`),
    enabled: !!employeeId,
  });
}

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

export function useSalaryAdvanceMutations() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const requestAdvance = useMutation({
    mutationFn: (data: CreateSalaryAdvanceRequest) =>
      apiRequest<SalaryAdvanceDTO>('/salary-advances', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          userId: session?.user?.id || data.userId,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success("Demande d'avance créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la demande: ${error.message}`);
    },
  });

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

  const validateAsAdmin = useMutation({
    mutationFn: ({ id, validatorId }: { id: string; validatorId: string }) => {
      return apiRequest(`/salary-advances/${id}/validate-admin`, {
        method: 'PATCH',
        body: JSON.stringify({ validatorId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success("Avance validée par l'administrateur");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la validation: ${error.message}`);
    },
  });

  const validateAsSuperAdmin = useMutation({
    mutationFn: ({ id, validatorId }: { id: string; validatorId: string }) => {
      return apiRequest(`/salary-advances/${id}/validate-superadmin`, {
        method: 'PATCH',
        body: JSON.stringify({ validatorId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success('Avance validée par le super-administrateur');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la validation: ${error.message}`);
    },
  });

  const rejectAdvance = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest(`/salary-advances/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-advances'] });
      toast.success('Avance rejetée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du rejet: ${error.message}`);
    },
  });

  return {
    requestAdvance,
    updateAdvance,
    updateStatus,
    deleteAdvance,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectAdvance,
  };
}
