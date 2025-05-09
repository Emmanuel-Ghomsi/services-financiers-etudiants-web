/**
 * Construit l'URL complète pour une image stockée sur le serveur
 * @param filename Nom du fichier ou UUID de l'image
 * @returns URL complète de l'image
 */
export function getImageUrl(filename: string | null | undefined): string {
  if (!filename) {
    return '/images/placeholder-profile.png'; // Image par défaut si aucun nom de fichier n'est fourni
  }

  // Vérifier si l'URL est déjà complète (commence par http:// ou https://)
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  // Vérifier si le chemin est déjà relatif au domaine
  if (filename.startsWith('/')) {
    return filename;
  }

  // Construire l'URL complète
  return `${process.env.NEXT_PUBLIC_API_PATH_URL}/public/medias/images/${filename}`;
}

/**
 * Ajoute un paramètre de cache-busting à une URL d'image
 * @param url URL de l'image
 * @returns URL avec un paramètre de cache-busting
 */
export function getImageUrlWithCacheBusting(url: string): string {
  // Utiliser un timestamp fixe pour éviter les re-rendus infinis
  // Tronquer le timestamp pour qu'il change moins souvent (toutes les heures par exemple)
  const timestamp = Math.floor(Date.now() / 3600000); // Change toutes les heures
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
}
