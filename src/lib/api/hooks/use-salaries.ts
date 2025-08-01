import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import type {
  SalaryDTO,
  SalaryPaginationDTO,
  CreateSalaryRequest,
  UpdateSalaryRequest,
  SalaryListRequest,
  SalaryPeriodFilterRequest,
  SalaryPeriodPaginatedRequest,
  SalaryPeriodPaginationDTO,
  SalaryPdfDataDTO,
} from '@/types/salary';

export function useSalaries(params: SalaryListRequest) {
  return useQuery<SalaryPaginationDTO>({
    queryKey: ['salaries', params],
    queryFn: () => {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      });
      return apiRequest<SalaryPaginationDTO>(`/salaries?${queryParams}`);
    },
  });
}

export function useSalary(id: string) {
  return useQuery<SalaryDTO>({
    queryKey: ['salary', id],
    queryFn: () => apiRequest<SalaryDTO>(`/salaries/${id}`),
    enabled: !!id,
  });
}

export function useSalariesByEmployee(employeeId: string) {
  return useQuery<SalaryDTO[]>({
    queryKey: ['salaries', 'employee', employeeId],
    queryFn: () => apiRequest<SalaryDTO[]>(`/salaries/employee/${employeeId}`),
    enabled: !!employeeId,
  });
}

export function useSalariesByPeriod(params: SalaryPeriodFilterRequest) {
  return useQuery<SalaryDTO[]>({
    queryKey: ['salaries', 'period', params],
    queryFn: () => {
      const queryParams = new URLSearchParams({
        month: params.month.toString(),
        year: params.year.toString(),
      });
      return apiRequest<SalaryDTO[]>(`/salaries/by-period?${queryParams}`);
    },
  });
}

export function useSalariesByPeriodPaginated(params: SalaryPeriodPaginatedRequest) {
  return useQuery<SalaryPeriodPaginationDTO>({
    queryKey: ['salaries', 'period', 'paginated', params],
    queryFn: () => {
      const queryParams = new URLSearchParams({
        month: params.month.toString(),
        year: params.year.toString(),
        page: params.page.toString(),
        limit: params.limit.toString(),
      });
      return apiRequest<SalaryPeriodPaginationDTO>(`/salaries/by-period/paginated?${queryParams}`);
    },
  });
}

export function useSalaryPdfData(id: string) {
  return useQuery<SalaryPdfDataDTO>({
    queryKey: ['salary', 'pdf', id],
    queryFn: () => apiRequest<SalaryPdfDataDTO>(`/salaries/${id}/pdf-data`),
    enabled: !!id,
  });
}

export function useSalaryMutations() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const createSalary = useMutation({
    mutationFn: (data: CreateSalaryRequest) =>
      apiRequest<SalaryDTO>('/salaries', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          userId: session?.user?.id || data.userId,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Fiche de salaire créée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    },
  });

  const updateSalary = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSalaryRequest }) =>
      apiRequest<SalaryDTO>(`/salaries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Fiche de salaire mise à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    },
  });

  const deleteSalary = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/salaries/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Fiche de salaire supprimée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });

  const validateAsAdmin = useMutation({
    mutationFn: ({ id, validatorId }: { id: string; validatorId: string }) => {
      return apiRequest(`/salaries/${id}/validate-admin`, {
        method: 'PATCH',
        body: JSON.stringify({ validatorId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success("Salaire validé par l'administrateur");
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la validation: ${error.message}`);
    },
  });

  const validateAsSuperAdmin = useMutation({
    mutationFn: ({ id, validatorId }: { id: string; validatorId: string }) => {
      return apiRequest(`/salaries/${id}/validate-superadmin`, {
        method: 'PATCH',
        body: JSON.stringify({ validatorId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salaire validé par le super-administrateur');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la validation: ${error.message}`);
    },
  });

  const rejectSalary = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest(`/salaries/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      toast.success('Salaire rejeté');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du rejet: ${error.message}`);
    },
  });

  return {
    createSalary,
    updateSalary,
    deleteSalary,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectSalary,
  };
}

export function useSalaryPdfDownload() {
  const downloadPdf = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PATH_URL}/salaries/${id}/pdf-data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-paie-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast.success('Fiche de paie téléchargée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du téléchargement: ${error.message}`);
    },
  });

  return {
    downloadPdf: downloadPdf.mutate,
    isDownloading: downloadPdf.isPending,
  };
}
