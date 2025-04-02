'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/lib/api/api-service';
import { useProfileStore } from '@/lib/stores/profile-store';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/user-profile';

export function useProfile() {
  const { data: session } = useSession();
  const { setProfile, setLoading, setError } = useProfileStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }
      return profileService.getProfile(session.accessToken);
    },
    enabled: !!session?.accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mettre à jour le store lorsque les données sont disponibles
  React.useEffect(() => {
    if (data) {
      console.log('Profil chargé:', data);
      console.log('Rôles du profil:', data.roles);
      setProfile(data);
    }
  }, [data, setProfile]);

  // Gérer les erreurs
  React.useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      console.error('Erreur lors du chargement du profil:', errorMessage);
      setError(errorMessage);
      toast(errorMessage, 'error');
    }
  }, [error, setError, toast]);

  return {
    profile: data as UserProfile | undefined,
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  };
}
