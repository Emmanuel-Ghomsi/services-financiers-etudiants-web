'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Hook pour vérifier l'état de la session et déconnecter l'utilisateur si nécessaire
 */
export function useAuthCheck() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Fonction pour gérer les erreurs de session
    const handleSessionError = async () => {
      if (session?.error) {
        console.error('Erreur de session détectée:', session.error);

        // Si l'erreur est liée à un token expiré, déconnecter l'utilisateur
        if (
          session.error === 'RefreshTokenExpired' ||
          session.error === 'RefreshAccessTokenError'
        ) {
          // Afficher un message à l'utilisateur
          toast.error('Votre session a expiré. Veuillez vous reconnecter.');

          // Déconnecter l'utilisateur
          await signOut({ redirect: false });

          // Rediriger vers la page de connexion
          router.push('/auth/login');
          return false;
        }
      }

      return true;
    };

    // Vérifier la session si elle est chargée
    if (status === 'authenticated') {
      handleSessionError();
    }
  }, [session, status, router]);

  return { session, status };
}
