/**
 * Fonction utilitaire pour télécharger un fichier côté client
 */
export function downloadFile(blob: Blob, filename: string) {
  // Créer une URL temporaire pour le blob
  const url = window.URL.createObjectURL(blob);

  // Créer un élément <a> temporaire pour déclencher le téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Ajouter le lien au DOM, cliquer dessus, puis le supprimer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Nettoyer l'URL temporaire
  window.URL.revokeObjectURL(url);
}

/**
 * Extraire le nom du fichier depuis une URL
 */
export function getFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url, window.location.origin);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'fichier';
    return filename;
  } catch {
    return 'fichier';
  }
}

/**
 * Obtenir l'extension d'un fichier depuis son nom
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
}
