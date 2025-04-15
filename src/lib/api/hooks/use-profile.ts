'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiRequest } from '@/lib/api/api-client';
import { useProfileStore } from '@/lib/stores/profile-store';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  roles: string[];
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

// Version simplifiée du hook pour éviter les boucles infinies
export function useProfile() {
  const { data: session, status } = useSession();
  const { profile, isLoading, error, setProfile, setLoading, setError } = useProfileStore();
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    // Ne pas charger le profil si l'utilisateur n'est pas connecté
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    // Ne pas charger le profil si la session est en cours de chargement
    if (status === 'loading') {
      return;
    }

    // Si nous avons déjà le profil dans le store ou si nous avons déjà tenté de le charger, ne pas le recharger
    if (profile || fetchAttempted || isLoading) {
      return;
    }

    // Charger le profil depuis l'API
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Utiliser le endpoint /auth/me au lieu de /user/profile
        const data = await apiRequest<UserProfile>('/auth/me');
        setProfile(data);
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
        setFetchAttempted(true);
      }
    };

    fetchProfile();
  }, [session, status, profile, isLoading, fetchAttempted, setProfile, setLoading, setError]);

  // Fonction pour rafraîchir manuellement le profil
  const refetch = async () => {
    if (status === 'authenticated') {
      setFetchAttempted(false); // Réinitialiser pour permettre un nouveau chargement
    }
  };

  return { profile, isLoading, error, refetch };
}
