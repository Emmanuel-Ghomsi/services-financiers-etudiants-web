'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { clientFileService } from '@/lib/api/api-service';
import { useClientFilesStore } from '@/lib/stores/client-files-store';
import { useProfileStore } from '@/lib/stores/profile-store';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import type { ClientFileListRequest, ClientFilePaginationDTO } from '@/types/client-file';
import { useEffect } from 'react';

export function useClientFiles(initialParams: Partial<ClientFileListRequest> = {}) {
  const { data: session } = useSession();
  const { profile } = useProfileStore();
  const { setClientFiles, setLoading, setError, filters } = useClientFilesStore();
  const { toast } = useToast();

  const isAdmin =
    profile?.roles?.some((role) => role === 'admin' || role === 'super-admin') || false;

  // Paramètres par défaut
  const defaultParams: ClientFileListRequest = {
    page: 1, // Page 1 par défaut
    pageSize: 10,
    pageLimit: 10,
    filters: { ...filters, ...initialParams.filters },
  };

  // Requête standard (non-infinie) pour la compatibilité avec le store
  const { data, isLoading, error, refetch } = useQuery<ClientFilePaginationDTO>({
    queryKey: ['clientFiles', isAdmin, defaultParams],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      if (isAdmin) {
        return clientFileService.getAllClientFiles(session.accessToken, defaultParams);
      } else {
        return clientFileService.getMyClientFiles(session.accessToken, defaultParams);
      }
    },
    enabled: !!session?.accessToken && !!profile,
  });

  // Mettre à jour le store lorsque les données sont disponibles
  useEffect(() => {
    if (data) {
      setClientFiles(data);
    }
  }, [data, setClientFiles]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast(errorMessage, 'error');
    }
  }, [error, setError, toast]);

  // Requête infinie pour la pagination
  const infiniteQuery = useInfiniteQuery<ClientFilePaginationDTO>({
    queryKey: ['clientFilesInfinite', isAdmin, filters],
    queryFn: async ({ pageParam }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Convertir explicitement pageParam en number avec une valeur par défaut de 1
      const page = typeof pageParam === 'number' ? pageParam : 1;

      const params: ClientFileListRequest = {
        ...defaultParams,
        page: page,
      };

      if (isAdmin) {
        return clientFileService.getAllClientFiles(session.accessToken, params);
      } else {
        return clientFileService.getMyClientFiles(session.accessToken, params);
      }
    },
    initialPageParam: 1, // Page 1 par défaut
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.currentPage > 1) {
        return firstPage.currentPage - 1;
      }
      return undefined;
    },
    enabled: !!session?.accessToken && !!profile,
  });

  return {
    // Données standard
    clientFiles: data?.items || [],
    pagination: data
      ? {
          currentPage: data.currentPage,
          totalItems: data.totalItems,
          totalPages: data.totalPages,
          pageSize: data.pageSize,
          pageLimit: data.pageLimit,
        }
      : null,
    isLoading,
    error,
    refetch,

    // Données infinies
    infiniteData: infiniteQuery.data,
    infiniteIsLoading: infiniteQuery.isLoading,
    infiniteError: infiniteQuery.error,
    fetchNextPage: infiniteQuery.fetchNextPage,
    fetchPreviousPage: infiniteQuery.fetchPreviousPage,
    hasNextPage: infiniteQuery.hasNextPage,
    hasPreviousPage: infiniteQuery.hasPreviousPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    isFetchingPreviousPage: infiniteQuery.isFetchingPreviousPage,
  };
}
