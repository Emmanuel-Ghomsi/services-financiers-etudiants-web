'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { apiRequest } from '@/lib/api/api-client';

interface UseApiOptions {
  onError?: (error: Error) => void;
  onSuccess?: <T>(data: T) => void;
}

export function useApi<T = unknown>(options: UseApiOptions = {}) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchData = useCallback(
    async (url: string, fetchOptions: RequestInit = {}) => {
      // Ne pas exécuter si la session n'est pas chargée
      if (status === 'loading') return null;

      // Vérifier si l'utilisateur est authentifié
      if (status === 'unauthenticated') {
        const error = new Error('Utilisateur non authentifié');
        setError(error);
        options.onError?.(error);
        return null;
      }

      // Vérifier si la session a une erreur
      if (session?.error) {
        const error = new Error(`Erreur de session: ${session.error}`);
        setError(error);
        options.onError?.(error);
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await apiRequest<T>(url, fetchOptions);
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [session, status, options]
  );

  return {
    fetchData,
    isLoading,
    error,
    data,
  };
}
