import { getSession } from 'next-auth/react';
import { validateSession, handleExpiredToken } from './auth-service';

/**
 * Fonction pour effectuer des requêtes API avec gestion automatique du token
 */
export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  // Vérifier si la session est valide
  const isValid = await validateSession();
  if (!isValid) {
    throw new Error('Session invalide');
  }

  // Obtenir la session pour récupérer le token d'accès
  const session = await getSession();
  const token = session?.accessToken;

  // Préparer les headers
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ajouter Content-Type: application/json si nécessaire
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Effectuer la requête
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Gérer les erreurs
  if (!response.ok) {
    if (response.status === 401) {
      try {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes('Refresh token expiré')) {
          await handleExpiredToken();
          throw new Error('Session expirée - Refresh token expiré');
        }
      } catch (e) {
        // Ignorer parsing JSON raté
      }

      const stillValid = await validateSession();
      if (stillValid) {
        return apiRequest<T>(url, options);
      }
      throw new Error('Session expirée');
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Une erreur est survenue');
  }

  // ✅ Cas particulier pour 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // Sinon, parser la réponse JSON
  return response.json();
}
