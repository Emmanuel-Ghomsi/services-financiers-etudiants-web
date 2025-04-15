'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { apiRequest } from '@/lib/api/api-client';

// Types pour les statistiques du tableau de bord
export interface DashboardSuperAdminDTO {
  totalUsers: number;
  totalAdvisors: number;
  totalAdmins: number;
  pendingSuperAdminValidations: number;
  totalValidatedFiles: number;
}

export interface DashboardAdminDTO {
  filesCreatedByMe: number;
  pendingAdminValidations: number;
  validatedByMe: number;
}

export interface DashboardAdvisorDTO {
  filesCreatedByMe: number;
  filesValidated: number;
}

export interface DashboardResponse {
  role: string;
  stats: DashboardSuperAdminDTO | DashboardAdminDTO | DashboardAdvisorDTO;
}

export interface DashboardData {
  superAdmin?: DashboardSuperAdminDTO;
  admin?: DashboardAdminDTO;
  advisor?: DashboardAdvisorDTO;
}

export function useDashboardStats() {
  const { data: session } = useSession();

  const query = useQuery<DashboardResponse>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<DashboardResponse>('/dashboard');
    },
    enabled: !!session?.accessToken,
  });

  // Organiser les données par rôle
  const dashboardData: DashboardData = {};

  if (query.data) {
    const { role, stats } = query.data;

    if (role === 'SUPER_ADMIN') {
      dashboardData.superAdmin = stats as DashboardSuperAdminDTO;
    } else if (role === 'ADMIN') {
      dashboardData.admin = stats as DashboardAdminDTO;
    } else if (role === 'ADVISOR') {
      dashboardData.advisor = stats as DashboardAdvisorDTO;
    }
  }

  return {
    data: dashboardData,
    rawData: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  };
}
