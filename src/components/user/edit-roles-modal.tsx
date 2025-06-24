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
  FormDescription,
} from '@/components/ui/form';
import type { UserDTO } from '@/types/user';
import { UserRoleBadge } from './user-role-badge';
import { useUpdateUserRole } from '@/lib/api/hooks/use-user-mutations';
import { LoadingButton } from '@/components/ui/loading-button';
import { MultiSelect } from '@/components/ui/multi-select';

const RoleEnum = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUB_ADMIN: 'SUB_ADMIN',
  ADVISOR: 'ADVISOR',
  RH: 'RH',
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

  // Options de rôles disponibles
  const roleOptions = [
    { value: RoleEnum.SUPER_ADMIN, label: 'Contrôle Interne' },
    { value: RoleEnum.ADMIN, label: 'Conformité' },
    { value: RoleEnum.SUB_ADMIN, label: 'Admin Délégué' },
    { value: RoleEnum.ADVISOR, label: 'Conseiller' },
    { value: RoleEnum.RH, label: 'RH' },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roles: user.roles || [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Déterminer les rôles à ajouter et à supprimer
    const rolesToAdd = values.roles;
    console.log(rolesToAdd);

    // Traiter chaque rôle séquentiellement
    let success = true;

    // Ajouter les nouveaux rôles
    try {
      await new Promise<void>((resolve, reject) => {
        updateRole(
          {
            userId: user.id,
            roles: { roles: values.roles },
          },
          {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          }
        );
      });
    } catch (error) {
      success = false;
    }

    // Si tout s'est bien passé
    if (success) {
      onSuccess();
      onClose();
    }
  };

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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sélectionnez les rôles</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={roleOptions}
                      value={roleOptions.filter((option) => field.value.includes(option.value))}
                      onChange={(newValue) => {
                        field.onChange(newValue.map((item) => item.value));
                      }}
                      placeholder="Sélectionnez les rôles..."
                    />
                  </FormControl>
                  <FormDescription>
                    Sélectionnez au moins un rôle pour l'utilisateur.
                  </FormDescription>
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
