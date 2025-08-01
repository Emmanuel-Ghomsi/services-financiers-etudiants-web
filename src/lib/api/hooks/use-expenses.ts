'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api/api-client';
import type {
  ExpenseDTO,
  ExpensePaginationDTO,
  ExpenseStatsDTO,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseListRequest,
  ExpenseFilterRequest,
  ExpenseStatsRequest,
} from '@/types/expense';

export function useExpenses(params: ExpenseListRequest) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async (): Promise<ExpensePaginationDTO> => {
      return apiRequest<ExpensePaginationDTO>(
        `/expenses?${new URLSearchParams(params as any).toString()}`
      );
    },
    enabled: !!session?.accessToken,
  });
}

export function useExpense(id: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['expense', id],
    queryFn: async (): Promise<ExpenseDTO> => {
      return apiRequest<ExpenseDTO>(`/expenses/${id}`);
    },
    enabled: !!session?.accessToken && !!id,
  });
}

export function useFilteredExpenses(filters: ExpenseFilterRequest) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['expenses', 'filtered', filters],
    queryFn: async (): Promise<ExpenseDTO[]> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      return apiRequest<ExpenseDTO[]>(`/expenses/filter?${params.toString()}`);
    },
    enabled: !!session?.accessToken,
  });
}

export function useExpenseStats(params: ExpenseStatsRequest) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['expenses', 'stats', params],
    queryFn: async (): Promise<ExpenseStatsDTO> => {
      return apiRequest<ExpenseStatsDTO>(
        `/expenses/statistics?${new URLSearchParams(params as any).toString()}`
      );
    },
    enabled: !!session?.accessToken,
  });
}

async function uploadExpenseFile(expenseId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiRequest<{ fileUrl: string }>(`/expenses/${expenseId}/upload`, {
    method: 'POST',
    body: formData,
  });

  return response.fileUrl;
}

export function useExpenseMutations() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { toast } = useToast();

  const createExpense = useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: CreateExpenseRequest;
      file?: File;
    }): Promise<ExpenseDTO> => {
      const expenseData = {
        ...data,
        userId: session?.user?.id || data.userId,
      };
      delete expenseData.fileUrl;

      const createdExpense = await apiRequest<ExpenseDTO>('/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData),
      });

      if (file) {
        try {
          const fileUrl = await uploadExpenseFile(createdExpense.id, file);
          return { ...createdExpense, fileUrl };
        } catch (error) {
          toast({
            title: 'Attention',
            description:
              "Dépense créée mais l'upload du fichier a échoué. Vous pouvez réessayer plus tard.",
            variant: 'destructive',
          });
          return createdExpense;
        }
      }

      return createdExpense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Succès',
        description: 'Dépense créée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la création de la dépense',
        variant: 'destructive',
      });
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({
      id,
      data,
      file,
    }: {
      id: string;
      data: UpdateExpenseRequest;
      file?: File;
    }): Promise<ExpenseDTO> => {
      const expenseData = { ...data };
      delete expenseData.fileUrl;

      const updatedExpense = await apiRequest<ExpenseDTO>(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(expenseData),
      });

      if (file) {
        try {
          const fileUrl = await uploadExpenseFile(id, file);
          return { ...updatedExpense, fileUrl };
        } catch (error) {
          toast({
            title: 'Attention',
            description:
              "Dépense modifiée mais l'upload du fichier a échoué. Vous pouvez réessayer plus tard.",
            variant: 'destructive',
          });
          return updatedExpense;
        }
      }

      return updatedExpense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Succès',
        description: 'Dépense modifiée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la modification de la dépense',
        variant: 'destructive',
      });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      return apiRequest<void>(`/expenses/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Succès',
        description: 'Dépense supprimée avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la suppression de la dépense',
        variant: 'destructive',
      });
    },
  });

  const validateAsAdmin = useMutation({
    mutationFn: async ({ id, validatorId }: { id: string; validatorId: string }) => {
      return apiRequest(`/expenses/${id}/validate-admin`, {
        method: 'PATCH',
        body: JSON.stringify({ validatorId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Succès',
        description: "Dépense validée par l'administrateur",
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la validation',
        variant: 'destructive',
      });
    },
  });

  const validateAsSuperAdmin = useMutation({
    mutationFn: async ({ id, validatorId }: { id: string; validatorId: string }) => {
      return apiRequest(`/expenses/${id}/validate-superadmin`, {
        method: 'PATCH',
        body: JSON.stringify({ validatorId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Succès',
        description: 'Dépense validée par le super-administrateur',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la validation',
        variant: 'destructive',
      });
    },
  });

  const rejectExpense = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest(`/expenses/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Succès',
        description: 'Dépense rejetée',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du rejet',
        variant: 'destructive',
      });
    },
  });

  const uploadFile = useMutation({
    mutationFn: async ({ expenseId, file }: { expenseId: string; file: File }): Promise<string> => {
      return uploadExpenseFile(expenseId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Succès',
        description: 'Fichier uploadé avec succès',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || "Erreur lors de l'upload du fichier",
        variant: 'destructive',
      });
    },
  });

  return {
    createExpense,
    updateExpense,
    deleteExpense,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectExpense,
    uploadFile,
  };
}
