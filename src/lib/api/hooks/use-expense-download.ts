'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/utils/file-download';

export function useExpenseDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const downloadJustificatif = async (expenseId: string, fileName?: string) => {
    if (!session?.accessToken) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour télécharger le fichier',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PATH_URL}/expenses/${expenseId}/justificatif`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Fichier non trouvé');
        }
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = fileName || 'piece-justificative';

      // Extraire le nom du fichier depuis les headers si disponible
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      downloadFile(blob, filename);

      toast({
        title: 'Succès',
        description: 'Fichier téléchargé avec succès',
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors du téléchargement',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadJustificatif,
    isDownloading,
  };
}
