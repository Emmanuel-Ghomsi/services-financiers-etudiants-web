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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { UserDTO } from '@/types/user';
import { useUpdateUser } from '@/lib/api/hooks/use-user-mutations';
import { LoadingButton } from '@/components/ui/loading-button';
import { MultiSelect } from '@/components/ui/multi-select';
import { useToast } from '@/hooks/use-toast';

// Enum des rôles (à adapter selon votre implémentation)
const RoleEnum = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUB_ADMIN: 'SUB_ADMIN',
  ADVISOR: 'ADVISOR',
} as const;

const formSchema = z.object({
  username: z.string().min(3, 'Le username est obligatoire'),
  email: z.string().email('Email invalide'),
  roles: z.array(z.string()).min(1, 'Au moins un rôle requis'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserModalProps {
  user: UserDTO;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { toast } = useToast();

  // Options de rôles disponibles
  const roleOptions = [
    { value: RoleEnum.SUPER_ADMIN, label: 'Super Admin' },
    { value: RoleEnum.ADMIN, label: 'Admin' },
    { value: RoleEnum.SUB_ADMIN, label: 'Admin Délégué' },
    { value: RoleEnum.ADVISOR, label: 'Conseiller' },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username || '',
      email: user.email || '',
      roles: user.roles || [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    // Vérifier si l'utilisateur peut être modifié
    if (user.hasSetPassword && user.status !== 'PENDING_VERIFICATION') {
      // Utilisons toast avec une seule chaîne de caractères
      toast(
        "Impossible de modifier un utilisateur qui s'est déjà connecté ou dont l'email est vérifié"
      );
      return;
    }

    updateUser(
      {
        userId: user.id,
        data: values,
      },
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
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur {user.username}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom d'utilisateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôles</FormLabel>
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
