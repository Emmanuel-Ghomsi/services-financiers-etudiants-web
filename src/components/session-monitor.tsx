'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SessionMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Vérifier si la session a une erreur
    if (session?.error) {
      console.error('Erreur de session détectée:', session.error);

      // Si l'erreur est liée à un token expiré, déconnecter l'utilisateur immédiatement
      if (session.error === 'RefreshTokenExpired' || session.error === 'RefreshAccessTokenError') {
        // Fonction asynchrone pour gérer la déconnexion
        const handleLogout = async () => {
          // Afficher un message à l'utilisateur
          toast.error('Votre session a expiré. Veuillez vous reconnecter.');

          // Déconnecter l'utilisateur
          await signOut({ redirect: false });

          // Rediriger vers la page de connexion
          router.push('/auth/login');
        };

        // Exécuter la fonction de déconnexion
        handleLogout();
      }
    }
  }, [session, router]);

  // Vérification périodique de la validité de la session
  useEffect(() => {
    // Fonction pour vérifier la session
    const checkSession = async () => {
      // Si l'utilisateur est authentifié mais qu'il y a une erreur
      if (status === 'authenticated' && session?.error) {
        // Déconnecter l'utilisateur
        await signOut({ redirect: false });
        router.push('/auth/login');
      }
    };

    // Vérifier la session toutes les 30 secondes
    const interval = setInterval(checkSession, 30000);

    // Nettoyer l'intervalle
    return () => clearInterval(interval);
  }, [session, status, router]);

  // Ce composant ne rend rien, il surveille simplement la session
  return null;
}
