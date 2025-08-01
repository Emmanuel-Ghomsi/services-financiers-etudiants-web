'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiRequest } from '@/lib/api/api-client';
import { toast } from 'sonner';
import type {
  LeaveDTO,
  LeavePaginationDTO,
  CreateLeaveRequest,
  UpdateLeaveRequest,
  LeaveListRequest,
  LeaveBalanceDTO,
  LeaveBalanceRequest,
  LeaveStatsDTO,
  LeaveStatsRequest,
  AbsenceCalendarDTO,
  ValidateLeaveRequest,
  RejectLeaveRequest,
  UpdateLeaveStatusRequest,
} from '@/types/leave';

export function useLeaves(params: LeaveListRequest) {
  const { data: session } = useSession();

  return useQuery<LeavePaginationDTO>({
    queryKey: ['leaves', params],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(`filters[${key}]`, value.toString());
          }
        });
      }

      return apiRequest<LeavePaginationDTO>(`/leaves?${queryParams.toString()}`);
    },
    enabled: !!session?.accessToken,
  });
}

export function useLeave(id: string) {
  const { data: session } = useSession();

  return useQuery<LeaveDTO>({
    queryKey: ['leave', id],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<LeaveDTO>(`/leaves/${id}`);
    },
    enabled: !!session?.accessToken && !!id,
  });
}

export function useLeavesByEmployee(employeeId: string) {
  const { data: session } = useSession();

  return useQuery<LeaveDTO[]>({
    queryKey: ['leaves', 'employee', employeeId],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<LeaveDTO[]>(`/leaves/employee/${employeeId}`);
    },
    enabled: !!session?.accessToken && !!employeeId,
  });
}

export function useLeaveBalance(params: LeaveBalanceRequest) {
  const { data: session } = useSession();

  return useQuery<LeaveBalanceDTO>({
    queryKey: ['leave-balance', params.employeeId, params.year],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('employeeId', params.employeeId);
      queryParams.append('year', params.year.toString());

      return apiRequest<LeaveBalanceDTO>(`/leaves/balance?${queryParams.toString()}`);
    },
    enabled: !!session?.accessToken && !!params.employeeId,
  });
}

export function useAllLeaveBalances() {
  const { data: session } = useSession();

  return useQuery<
    Array<{ employeeId: string; acquired: number; taken: number; remaining: number }>
  >({
    queryKey: ['leave-balances'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<
        Array<{ employeeId: string; acquired: number; taken: number; remaining: number }>
      >('/leaves/balances');
    },
    enabled: !!session?.accessToken,
  });
}

export function useAbsenceCalendar() {
  const { data: session } = useSession();

  return useQuery<AbsenceCalendarDTO[]>({
    queryKey: ['absence-calendar'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<AbsenceCalendarDTO[]>('/leaves/calendar');
    },
    enabled: !!session?.accessToken,
  });
}

export function useLeaveStats(params: LeaveStatsRequest) {
  const { data: session } = useSession();

  return useQuery<LeaveStatsDTO>({
    queryKey: ['leave-stats', params.year, params.employeeId],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('year', params.year.toString());
      if (params.employeeId) {
        queryParams.append('employeeId', params.employeeId);
      }

      return apiRequest<LeaveStatsDTO>(`/leaves/statistics?${queryParams.toString()}`);
    },
    enabled: !!session?.accessToken,
  });
}

export function useLeaveMutations() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const createLeave = useMutation({
    mutationFn: async (data: CreateLeaveRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<LeaveDTO>('/leaves', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      queryClient.invalidateQueries({ queryKey: ['absence-calendar'] });
      toast.success('Demande de congé créée avec succès');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de la création de la demande'
      );
    },
  });

  const updateLeave = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeaveRequest }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest<LeaveDTO>(`/leaves/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      toast.success('Demande de congé mise à jour avec succès');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    },
  });

  const deleteLeave = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest(`/leaves/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
      queryClient.invalidateQueries({ queryKey: ['absence-calendar'] });
      toast.success('Demande de congé supprimée avec succès');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    },
  });

  const validateAsAdmin = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ValidateLeaveRequest }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest(`/leaves/${id}/validate-admin`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      toast.success("Congé validé par l'administrateur");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la validation');
    },
  });

  const validateAsSuperAdmin = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ValidateLeaveRequest }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest(`/leaves/${id}/validate-superadmin`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      toast.success('Congé validé par le super-administrateur');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la validation');
    },
  });

  const rejectLeave = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RejectLeaveRequest }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest(`/leaves/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      toast.success('Congé rejeté');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du rejet');
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeaveStatusRequest }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return apiRequest(`/leaves/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      toast.success('Statut mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut'
      );
    },
  });

  return {
    createLeave,
    updateLeave,
    deleteLeave,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectLeave,
    updateStatus,
  };
}
