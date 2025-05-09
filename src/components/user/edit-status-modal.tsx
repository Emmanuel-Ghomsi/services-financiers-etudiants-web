'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UserDTO } from '@/types/user';
import { UserStatusBadge } from './user-status-badge';
import { useUpdateUserStatus } from '@/lib/api/hooks/use-user-mutations';
import { LoadingButton } from '@/components/ui/loading-button';

const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING_DELETION: 'PENDING_DELETION',
} as const;

type StatusType = keyof typeof UserStatus;

const formSchema = z.object({
  status: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditStatusModalProps {
  user: UserDTO;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditStatusModal({ user, isOpen, onClose, onSuccess }: EditStatusModalProps) {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: user.status || UserStatus.ACTIVE,
    },
  });

  const onSubmit = async (values: FormValues) => {
    updateStatus(
      {
        userId: user.id,
        status: { status: values.status },
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      }
    );
  };

  const statuses = [
    { id: UserStatus.ACTIVE, label: 'Actif' },
    { id: UserStatus.INACTIVE, label: 'Inactif' },
    { id: UserStatus.BLOCKED, label: 'Bloqué' },
    { id: UserStatus.PENDING_DELETION, label: 'Suppression en attente' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le statut</DialogTitle>
          <DialogDescription>Modifiez le statut de l'utilisateur {user.username}</DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Statut actuel:</h4>
          <UserStatusBadge status={user.status || 'ACTIVE'} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sélectionnez le nouveau statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isPending} loadingText="Enregistrement...">
                Enregistrer
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
