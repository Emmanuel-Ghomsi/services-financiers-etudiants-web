'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useUserStore } from '@/lib/stores/user-store';
import type {
  UserListRequest,
  UserPaginationDTO,
  RegisterUserRequest,
  UserDTO,
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH_URL;

export function useUsers(params: UserListRequest, options?: { enabled?: boolean }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { setUsers, setLoading, setError, addUser } = useUserStore();
  const queryClient = useQueryClient();

  const query = useQuery<UserPaginationDTO>({
    queryKey: ['users', params],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('pageSize', params.pageSize.toString());

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(`filters[${key}]`, value);
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/user?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des utilisateurs');
      }

      return response.json();
    },
    enabled: (options?.enabled ?? true) && !!session?.accessToken,
  });

  // Mettre à jour le store lorsque les données sont disponibles
  useEffect(() => {
    if (query.data) {
      setUsers(query.data);
    }
  }, [query.data, setUsers]);

  // Gérer les erreurs avec useEffect
  useEffect(() => {
    if (query.error) {
      const errorMessage =
        query.error instanceof Error ? query.error.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [query.error, setError, toast]);

  // Mettre à jour le statut de chargement
  useEffect(() => {
    setLoading(query.isPending);
  }, [query.isPending, setLoading]);

  // Fonction pour créer un nouvel utilisateur
  const registerUserMutation = useMutation({
    mutationFn: async (userData: RegisterUserRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création de l'utilisateur");
      }

      return response.json();
    },
    onSuccess: (data) => {
      addUser(data as UserDTO);
      toast({
        title: 'Succès',
        description: 'Utilisateur créé avec succès',
        variant: 'default',
      });

      // Invalider le cache pour forcer un rechargement des données
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur",
        variant: 'destructive',
      });
    },
  });

  const registerUser = async (userData: RegisterUserRequest): Promise<UserDTO | null> => {
    try {
      return (await registerUserMutation.mutateAsync(userData)) as UserDTO;
    } catch (error) {
      return null;
    }
  };

  return {
    data: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    registerUser,
    isRegistering: registerUserMutation.isPending,
  };
}
