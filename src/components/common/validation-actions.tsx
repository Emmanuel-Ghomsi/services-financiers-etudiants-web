'use client';

import { useState } from 'react';
import { Check, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ValidationStatus } from '@/types/validation';
import { useProfile } from '@/lib/api/hooks/use-profile';

interface ValidationActionsProps {
  itemId: string;
  currentStatus: ValidationStatus;
  onValidateAsAdmin: (id: string, validatorId: string) => void;
  onValidateAsSuperAdmin: (id: string, validatorId: string) => void;
  onReject: (id: string, reason: string) => void;
  isLoading?: boolean;
}

export function ValidationActions({
  itemId,
  currentStatus,
  onValidateAsAdmin,
  onValidateAsSuperAdmin,
  onReject,
  isLoading = false,
}: ValidationActionsProps) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { profile } = useProfile();

  const isAdmin = profile?.roles?.some((role) => role.toUpperCase() === 'ADMIN');
  const isSuperAdmin = profile?.roles?.some((role) => role.toUpperCase() === 'SUPER_ADMIN');

  const canValidateAsAdmin =
    isAdmin &&
    (currentStatus === ValidationStatus.AWAITING_ADMIN_VALIDATION || currentStatus === null);
  const canValidateAsSuperAdmin =
    isSuperAdmin && currentStatus === ValidationStatus.AWAITING_SUPERADMIN_VALIDATION;
  const canReject =
    (isAdmin || isSuperAdmin) &&
    currentStatus !== ValidationStatus.VALIDATED &&
    currentStatus !== ValidationStatus.REJECTED;

  const handleValidateAsAdmin = () => {
    if (profile?.id) {
      onValidateAsAdmin(itemId, profile.id);
    }
  };

  const handleValidateAsSuperAdmin = () => {
    if (profile?.id) {
      onValidateAsSuperAdmin(itemId, profile.id);
    }
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(itemId, rejectReason.trim());
      setIsRejectDialogOpen(false);
      setRejectReason('');
    }
  };

  if (!canValidateAsAdmin && !canValidateAsSuperAdmin && !canReject) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {canValidateAsAdmin && (
          <Button
            size="sm"
            onClick={handleValidateAsAdmin}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Valider (Admin)
          </Button>
        )}

        {canValidateAsSuperAdmin && (
          <Button
            size="sm"
            onClick={handleValidateAsSuperAdmin}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Valider (Super Admin)
          </Button>
        )}

        {canReject && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-1" />
            Rejeter
          </Button>
        )}
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l'élément</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Motif du rejet *</Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Expliquez pourquoi vous rejetez cet élément..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isLoading}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
