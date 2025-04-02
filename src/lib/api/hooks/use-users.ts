'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
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

export function useUsers(params: UserListRequest) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { setUsers, setLoading, setError, addUser } = useUserStore();

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
    enabled: !!session?.accessToken,
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
      toast(errorMessage, 'error');
    }
  }, [query.error, setError, toast]);

  // Mettre à jour le statut de chargement
  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

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
      toast('Utilisateur créé avec succès', 'success');
    },
    onError: (error) => {
      toast(
        error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur",
        'error'
      );
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
    ...query,
    registerUser,
  };
}
