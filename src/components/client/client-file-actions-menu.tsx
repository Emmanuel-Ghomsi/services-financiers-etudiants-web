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
  Mail,
  Download,
} from 'lucide-react';
import { useState } from 'react';
import { useClientFiles } from '@/lib/api/hooks/use-client-files';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RejectFileDialog } from './reject-file-dialog';
import { SendPdfEmailDialog } from './send-pdf-email-dialog';

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
    exportFileToExcel,
  } = useClientFiles();
  const { toast } = useToast();
  const router = useRouter();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [sendEmailDialogOpen, setSendEmailDialogOpen] = useState(false);
  const [confirmValidateDialogOpen, setConfirmValidateDialogOpen] = useState(false);
  const [validationType, setValidationType] = useState<'admin' | 'superadmin' | null>(null);
  const [incompleteFileDialogOpen, setIncompleteFileDialogOpen] = useState(false);

  // Fonction pour calculer la progression d'une fiche client
  const calculateCompletion = (clientFile: ClientFileDTO) => {
    // Cette logique devra être adaptée selon votre modèle de données
    let completedSteps = 0;
    const totalSteps = 9; // Nombre total d'étapes

    // Vérifier chaque étape
    if (clientFile.reference && clientFile.clientCode) completedSteps++;
    if (clientFile.lastName && clientFile.firstName) completedSteps++;
    if (clientFile.homeAddress) completedSteps++;
    if (clientFile.profession) completedSteps++;
    if (clientFile.incomeSources) completedSteps++;
    if (clientFile.hasInternationalOps !== null) completedSteps++;
    if (clientFile.offeredAccounts) completedSteps++;
    if (clientFile.isPEP !== null) completedSteps++;
    if (clientFile.riskLevel) completedSteps++;

    return Math.round((completedSteps / totalSteps) * 100);
  };

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

  const initiateValidation = (type: 'admin' | 'superadmin') => {
    const completion = calculateCompletion(file);

    if (completion < 100) {
      setValidationType(type);
      setIncompleteFileDialogOpen(true);
    } else {
      setValidationType(type);
      setConfirmValidateDialogOpen(true);
    }
  };

  const handleValidateAsAdmin = async () => {
    try {
      await validateAsAdmin(file.id);
      toast({
        title: 'Succès',
        description: 'La fiche client a été validée avec succès',
      });
      setConfirmValidateDialogOpen(false);
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
      setConfirmValidateDialogOpen(false);
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
      setIncompleteFileDialogOpen(false);
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

  /*const handleExportExcel = async () => {
    try {
      await exportFileToExcel(file.id);
      toast({
        title: 'Succès',
        description: 'Export Excel en cours de téléchargement',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'exporter la fiche client en Excel",
        variant: 'destructive',
      });
    }
  };*/

  const handleConfirmValidation = () => {
    if (validationType === 'admin') {
      handleValidateAsAdmin();
    } else if (validationType === 'superadmin') {
      handleValidateAsSuperAdmin();
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
            <DropdownMenuItem onClick={() => initiateValidation('admin')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Valider (Conformité)</span>
            </DropdownMenuItem>
          )}

          {permissions.canValidateAsSuperAdmin(file) && (
            <DropdownMenuItem onClick={() => initiateValidation('superadmin')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Valider (Contrôle Interne)</span>
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

              {/*<DropdownMenuItem onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" />
                <span>Exporter en Excel</span>
              </DropdownMenuItem> */}

              <DropdownMenuItem onClick={() => setSendEmailDialogOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Envoyer par email</span>
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

      {/* Dialogue d'envoi par email */}
      <SendPdfEmailDialog
        open={sendEmailDialogOpen}
        onOpenChange={setSendEmailDialogOpen}
        clientFileId={file.id}
        clientEmail={file.email}
      />

      {/* Dialogue de confirmation de validation */}
      <Dialog open={confirmValidateDialogOpen} onOpenChange={setConfirmValidateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmation de validation</DialogTitle>
            <DialogDescription>
              Cette action est irréversible ! Rassurez-vous d'avoir consulté tous les champs avant
              validation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir valider cette fiche client ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmValidateDialogOpen(false)}>
              Non
            </Button>
            <Button onClick={handleConfirmValidation}>Oui, valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour fiche incomplète */}
      <Dialog open={incompleteFileDialogOpen} onOpenChange={setIncompleteFileDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Fiche incomplète</DialogTitle>
            <DialogDescription>
              La fiche client n'est pas complète à 100%. Il est recommandé de la rejeter pour que
              l'agent puisse la compléter.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Souhaitez-vous rejeter cette fiche ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIncompleteFileDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIncompleteFileDialogOpen(false);
                setRejectDialogOpen(true);
              }}
            >
              Rejeter la fiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
