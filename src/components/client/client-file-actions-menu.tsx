'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClientFilePermissions } from '@/hooks/use-client-file-permissions';
import type { ClientFileDTO } from '@/types/client-file';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  FileText,
  Download,
} from 'lucide-react';
import { useState } from 'react';
import { useClientFiles } from '@/lib/api/hooks/use-client-files';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { RejectFileDialog } from './reject-file-dialog';

interface ClientFileActionsMenuProps {
  file: ClientFileDTO;
  onActionComplete?: () => void;
}

export function ClientFileActionsMenu({ file, onActionComplete }: ClientFileActionsMenuProps) {
  const permissions = useClientFilePermissions();
  const {
    submitFile,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectFile,
    deleteFile,
    exportFileToPDF,
    exportFileToWord,
  } = useClientFiles();
  const { toast } = useToast();
  const router = useRouter();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/clients/${file.id}`);
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fiche client ?')) {
      try {
        await deleteFile(file.id);
        toast({
          title: 'Succès',
          description: 'La fiche client a été supprimée avec succès',
        });
        onActionComplete?.();
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer la fiche client',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await submitFile(file.id);
      toast({
        title: 'Succès',
        description: 'La fiche client a été soumise pour validation',
      });
      onActionComplete?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de soumettre la fiche client',
        variant: 'destructive',
      });
    }
  };

  const handleValidateAsAdmin = async () => {
    try {
      await validateAsAdmin(file.id);
      toast({
        title: 'Succès',
        description: 'La fiche client a été validée avec succès',
      });
      onActionComplete?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de valider la fiche client',
        variant: 'destructive',
      });
    }
  };

  const handleValidateAsSuperAdmin = async () => {
    try {
      await validateAsSuperAdmin(file.id);
      toast({
        title: 'Succès',
        description: 'La fiche client a été validée avec succès',
      });
      onActionComplete?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de valider la fiche client',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (reason: string) => {
    try {
      await rejectFile(file.id, reason);
      toast({
        title: 'Succès',
        description: 'La fiche client a été rejetée',
      });
      setRejectDialogOpen(false);
      onActionComplete?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de rejeter la fiche client',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportFileToPDF(file.id);
      toast({
        title: 'Succès',
        description: 'Export PDF en cours de téléchargement',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'exporter la fiche client en PDF",
        variant: 'destructive',
      });
    }
  };

  const handleExportWord = async () => {
    try {
      await exportFileToWord(file.id);
      toast({
        title: 'Succès',
        description: 'Export Word en cours de téléchargement',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'exporter la fiche client en Word",
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {permissions.canEditFile(file) && (
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
          )}

          {permissions.canDeleteFile(file) && (
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          )}

          {permissions.canSubmitFile(file) && (
            <DropdownMenuItem onClick={handleSubmit}>
              <Send className="mr-2 h-4 w-4" />
              <span>Soumettre pour validation</span>
            </DropdownMenuItem>
          )}

          {permissions.canValidateAsAdmin(file) && (
            <DropdownMenuItem onClick={handleValidateAsAdmin}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Valider (Admin)</span>
            </DropdownMenuItem>
          )}

          {permissions.canValidateAsSuperAdmin(file) && (
            <DropdownMenuItem onClick={handleValidateAsSuperAdmin}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Valider (Super Admin)</span>
            </DropdownMenuItem>
          )}

          {permissions.canRejectFile(file) && (
            <DropdownMenuItem onClick={() => setRejectDialogOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              <span>Rejeter</span>
            </DropdownMenuItem>
          )}

          {permissions.canExportFile(file) && (
            <>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Exporter en PDF</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleExportWord}>
                <Download className="mr-2 h-4 w-4" />
                <span>Exporter en Word</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RejectFileDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onReject={handleReject}
      />
    </>
  );
}
