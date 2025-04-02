'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import type { UserDTO } from '@/types/user';
import { UserRoleBadge } from './user-role-badge';
import { useUpdateUserRole } from '@/lib/api/hooks/use-user-mutations';
import { LoadingButton } from '@/components/ui/loading-button';

const RoleEnum = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUB_ADMIN: 'SUB_ADMIN',
  ADVISOR: 'ADVISOR',
} as const;

type RoleType = keyof typeof RoleEnum;

const formSchema = z.object({
  roles: z.array(z.string()).min(1, { message: 'Au moins un rôle doit être sélectionné' }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditRolesModalProps {
  user: UserDTO;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditRolesModal({ user, isOpen, onClose, onSuccess }: EditRolesModalProps) {
  const { mutate: updateRole, isPending } = useUpdateUserRole();
  const [processingRoles, setProcessingRoles] = useState<string[]>([]);
  const isLoading = isPending || processingRoles.length > 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roles: user.roles || [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Déterminer les rôles à ajouter et à supprimer
    const rolesToAdd = values.roles.filter((role) => !user.roles.includes(role));
    const rolesToRemove = user.roles.filter((role) => !values.roles.includes(role));

    setProcessingRoles([...rolesToAdd, ...rolesToRemove]);

    // Traiter chaque rôle séquentiellement
    let success = true;

    // Ajouter les nouveaux rôles
    for (const role of rolesToAdd) {
      try {
        await new Promise<void>((resolve, reject) => {
          updateRole(
            {
              userId: user.id,
              role: { role },
            },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            }
          );
        });
      } catch (error) {
        success = false;
        break;
      }
    }

    // Si tout s'est bien passé
    if (success) {
      onSuccess();
      onClose();
    }

    setProcessingRoles([]);
  };

  const roles = [
    { id: RoleEnum.SUPER_ADMIN, label: 'Super Admin' },
    { id: RoleEnum.ADMIN, label: 'Admin' },
    { id: RoleEnum.SUB_ADMIN, label: 'Admin Délégué' },
    { id: RoleEnum.ADVISOR, label: 'Conseiller' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier les rôles</DialogTitle>
          <DialogDescription>Modifiez les rôles de l'utilisateur {user.username}</DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Rôles actuels:</h4>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <UserRoleBadge key={role} role={role} />
            ))}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Sélectionnez les rôles</FormLabel>
                  </div>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <FormField
                        key={role.id}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== role.id)
                                        );
                                  }}
                                  disabled={processingRoles.includes(role.id)}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{role.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isLoading} loadingText="Enregistrement...">
                Enregistrer
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
