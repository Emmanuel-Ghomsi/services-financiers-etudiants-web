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

  console.log(`API_URL : ${process.env.NEXT_PUBLIC_API_PATH_URL}`);
  

  // Obtenir la session pour récupérer le token d'accès
  const session = await getSession();
  const token = session?.accessToken;

  // Préparer les headers
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ajouter Content-Type: application/json si nécessaire
  // Ne pas l'ajouter si c'est un FormData (pour l'upload de fichiers)
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Effectuer la requête avec credentials: 'include'
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include', // Ajouter cette ligne pour inclure les cookies
  });

  // Gérer les erreurs
  if (!response.ok) {
    // Si le token est expiré (401)
    if (response.status === 401) {
      // Vérifier si l'erreur est "Refresh token expiré"
      try {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes('Refresh token expiré')) {
          await handleExpiredToken();
          throw new Error('Session expirée - Refresh token expiré');
        }
      } catch (e) {
        // Ignorer les erreurs de parsing JSON
      }

      // Vérifier à nouveau la session
      const stillValid = await validateSession();
      if (stillValid) {
        // Réessayer la requête si la session est toujours valide
        return apiRequest<T>(url, options);
      }

      throw new Error('Session expirée');
    }

    // Autres erreurs
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Une erreur est survenue');
  }

  // Retourner les données
  return response.json();
}
