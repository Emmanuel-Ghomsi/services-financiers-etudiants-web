'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, X, ZoomIn, ZoomOut, RotateCw, FileText, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useExpenseDownload } from '@/lib/api/hooks/use-expense-download';
import { getFileNameFromUrl, getFileExtension } from '@/lib/utils/file-download';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string;
  fileName?: string;
  fileUrl?: string;
}

export function DocumentViewer({
  isOpen,
  onClose,
  expenseId,
  fileName,
  fileUrl,
}: DocumentViewerProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const { data: session } = useSession();
  const { toast } = useToast();
  const { downloadJustificatif, isDownloading } = useExpenseDownload();

  const displayFileName = fileName || (fileUrl ? getFileNameFromUrl(fileUrl) : 'Document');
  const fileExtension = getFileExtension(displayFileName);

  useEffect(() => {
    if (isOpen && expenseId) {
      loadDocument();
    }
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [isOpen, expenseId]);

  const loadDocument = async () => {
    if (!session?.accessToken) {
      setError('Vous devez être connecté pour visualiser le document');
      return;
    }

    setIsLoading(true);
    setError(null);

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
          throw new Error('Document non trouvé');
        }
        throw new Error('Erreur lors du chargement du document');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDocumentUrl(url);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du chargement du document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    await downloadJustificatif(expenseId, displayFileName);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const renderDocument = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Skeleton className="h-64 w-full" />
            <p className="text-sm text-gray-500">Chargement du document...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">Erreur de chargement</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
            <Button onClick={loadDocument} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      );
    }

    if (!documentUrl) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <FileText className="h-16 w-16 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-500">Aucun document à afficher</p>
          </div>
        </div>
      );
    }

    // Gestion des différents types de fichiers
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';

    if (isImage) {
      return (
        <div className="flex items-center justify-center min-h-96 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={documentUrl || '/placeholder.svg'}
            alt={displayFileName}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="h-96 bg-gray-50 rounded-lg overflow-hidden">
          <iframe
            src={documentUrl}
            className="w-full h-full border-0"
            title={displayFileName}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
            }}
          />
        </div>
      );
    }

    // Pour les autres types de fichiers
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-blue-500 mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-900">Aperçu non disponible</p>
            <p className="text-sm text-gray-500">
              Ce type de fichier ({fileExtension.toUpperCase()}) ne peut pas être prévisualisé.
            </p>
          </div>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Téléchargement...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Télécharger le fichier
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold truncate pr-4">
            {displayFileName}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {/* Contrôles de zoom et rotation pour les images */}
            {documentUrl &&
              ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension) && (
                <>
                  <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}

            {/* Bouton de téléchargement */}
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>

            {/* Bouton de fermeture */}
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(90vh-8rem)]">{renderDocument()}</div>
      </DialogContent>
    </Dialog>
  );
}
