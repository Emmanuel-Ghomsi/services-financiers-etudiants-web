'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api/api-client';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useNotifications() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les notifications non lues
  const query = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<Notification[]>('/notifications');
    },
    enabled: !!session?.accessToken,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    staleTime: 10000, // Considérer les données comme fraîches pendant 10 secondes
  });

  // Mutation pour marquer toutes les notifications comme lues
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>('/notifications/read', {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors du marquage des notifications comme lues',
        variant: 'destructive',
      });
    },
  });

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = async (): Promise<void> => {
    await markAllAsReadMutation.mutateAsync();
  };

  return {
    notifications: query.data || [],
    unreadCount: query.data?.filter((n) => !n.read).length || 0,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    markAllAsRead,
    isMarking: markAllAsReadMutation.isPending,
  };
}
