'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Upload, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SendPdfEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientFileId: string;
  clientEmail?: string | null;
}

export function SendPdfEmailDialog({
  open,
  onOpenChange,
  clientFileId,
  clientEmail,
}: SendPdfEmailDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Format invalide',
          description: 'Veuillez sélectionner un fichier PDF',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: 'Fichier manquant',
        description: 'Veuillez sélectionner un fichier PDF à envoyer',
        variant: 'destructive',
      });
      return;
    }

    if (!session?.accessToken) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être authentifié pour effectuer cette action',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PATH_URL}/client-files/${clientFileId}/send-pdf`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi du PDF par email");
      }

      toast({
        title: 'Succès',
        description: "Le PDF a été envoyé avec succès à l'adresse email du client",
      });

      // Réinitialiser et fermer le dialogue
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi du PDF:", error);
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : "Erreur lors de l'envoi du PDF par email",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Envoyer le PDF par email</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier PDF à envoyer à l'adresse email du client.
          </DialogDescription>
        </DialogHeader>

        {!clientEmail && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Ce client n'a pas d'adresse email renseignée. Veuillez d'abord ajouter une adresse
              email dans les informations du client.
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />

          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50"
            onClick={handleSelectFile}
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner un fichier PDF'}
            </p>
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Annuler
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!selectedFile || !clientEmail}
          >
            <Mail className="mr-2 h-4 w-4" />
            Envoyer par email
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
