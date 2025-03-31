'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useToast } from './use-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Vérifier si le token est expiré ou a une erreur
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      toast('Votre session a expiré. Veuillez vous reconnecter.', 'error');
      logout();
    } else if (session?.error === 'RefreshTokenExpired') {
      toast('Votre session a expiré. Veuillez vous reconnecter.', 'error');
      logout();
    }
  }, [session]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast('Échec de la connexion. Vérifiez vos identifiants.', 'error');
        return false;
      }

      // Forcer la mise à jour de la session
      await update();

      toast('Connexion réussie', 'success');
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast('Une erreur est survenue lors de la connexion', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirect: false });
      toast('Déconnexion réussie', 'success');
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast('Une erreur est survenue lors de la déconnexion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || isLoading,
    login,
    logout,
  };
}
