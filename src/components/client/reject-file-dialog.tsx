'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/ui/loading-button';

interface RejectFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => Promise<void>;
}

export function RejectFileDialog({ open, onOpenChange, onReject }: RejectFileDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(reason);
      setReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rejeter la fiche client</DialogTitle>
          <DialogDescription>
            Veuillez indiquer la raison du rejet. Cette information sera communiquée au créateur de
            la fiche.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Raison du rejet..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
          {reason.trim().length === 0 && (
            <p className="text-sm text-red-500 mt-2">La raison du rejet est obligatoire</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Envoi en cours..."
            disabled={reason.trim().length === 0}
          >
            Rejeter la fiche
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
