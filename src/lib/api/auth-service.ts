import { signOut, getSession } from 'next-auth/react';
import { toast } from 'sonner';

interface RefreshTokenResponse {
  access_token: string;
  expire_date: string;
  refresh_token: string;
  refresh_expire_date: string;
}

/**
 * Rafraîchit le token d'accès en utilisant le refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      // Vérifier si l'erreur est "Refresh token expiré"
      try {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes('Refresh token expiré')) {
          await handleExpiredToken();
          return null;
        }
      } catch (e) {
        // Ignorer les erreurs de parsing JSON
      }

      throw new Error('Échec du rafraîchissement du token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);

    // Si l'erreur contient "Refresh token expiré", gérer l'expiration
    if (error instanceof Error && error.message.includes('Refresh token expiré')) {
      await handleExpiredToken();
    }

    return null;
  }
}

/**
 * Gère le cas d'un token expiré en déconnectant l'utilisateur et en le redirigeant
 */
export async function handleExpiredToken(): Promise<void> {
  // Déconnecter l'utilisateur
  await signOut({ redirect: false });

  // Afficher un message d'erreur
  toast.error('Votre session a expiré. Veuillez vous reconnecter.');

  // Rediriger vers la page de connexion
  window.location.href = '/auth/login?error=RefreshTokenExpired';
}

/**
 * Vérifie si la session est valide et gère les erreurs de token
 */
export async function validateSession(): Promise<boolean> {
  const session = await getSession();

  // Si pas de session, déconnecter l'utilisateur
  if (!session) {
    await handleExpiredToken();
    return false;
  }

  // Vérifier les erreurs de session
  if (session.error) {
    // Si l'erreur est liée à un token expiré, déconnecter l'utilisateur et rediriger
    if (session.error === 'RefreshTokenExpired' || session.error === 'RefreshAccessTokenError') {
      await handleExpiredToken();
      return false;
    }

    // Autres erreurs
    console.error('Erreur de session:', session.error);
    return false;
  }

  return true;
}
