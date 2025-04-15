'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { UserDTO } from '@/types/user';
import { AlertCircle } from 'lucide-react';
import { useResendFirstLoginEmail } from '@/lib/api/hooks/use-user-mutations';
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from '@/hooks/use-toast';

interface ResendPasswordModalProps {
  user: UserDTO;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResendPasswordModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: ResendPasswordModalProps) {
  const { mutate: resendEmail, isPending } = useResendFirstLoginEmail();
  const { toast } = useToast();

  const handleResend = async () => {
    // Vérifier si l'utilisateur peut recevoir un email de mot de passe
    if (user.hasSetPassword && user.status !== 'PENDING_VERIFICATION') {
      // Utilisons toast avec une seule chaîne de caractères
      toast(
        "Impossible d'envoyer un email de réinitialisation à un utilisateur qui s'est déjà connecté ou dont l'email est vérifié"
      );
      return;
    }

    resendEmail(
      { email: user.email },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Renvoyer l'email de définition de mot de passe</DialogTitle>
          <DialogDescription>
            Envoyez un nouvel email à {user.email} pour définir le mot de passe
          </DialogDescription>
        </DialogHeader>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p>
              Cette action n'est utile que pour les utilisateurs qui ne se sont jamais connectés et
              n'ont pas encore défini leur mot de passe.
            </p>
            <p className="mt-2">
              Êtes-vous sûr de vouloir envoyer un nouvel email de définition de mot de passe à cet
              utilisateur?
            </p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <LoadingButton
            onClick={handleResend}
            isLoading={isPending}
            loadingText="Envoi en cours..."
          >
            Envoyer l'email
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
