'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useUsers } from '@/lib/api/hooks/use-users';
import { useRouter } from 'next/navigation';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';

// Définir l'enum des rôles
const RoleEnum = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SUB_ADMIN: 'SUB_ADMIN',
  ADVISOR: 'ADVISOR',
} as const;

type RoleType = keyof typeof RoleEnum;

// Schéma de validation pour le formulaire
const formSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email('Email invalide'),
  roles: z.array(z.string()).min(1, 'Au moins un rôle doit être attribué'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddUserPage() {
  const { profile } = useProfile();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser } = useUsers({ page: 1, pageSize: 10 });

  // Options de rôles disponibles
  const roleOptions: MultiSelectOption[] = [
    { value: RoleEnum.SUPER_ADMIN, label: 'Super Administrateur' },
    { value: RoleEnum.ADMIN, label: 'Administrateur' },
    { value: RoleEnum.SUB_ADMIN, label: 'Admin Délégué' },
    { value: RoleEnum.ADVISOR, label: 'Conseiller' },
  ];

  // Initialiser le formulaire
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      roles: ['ADVISOR'],
    },
  });

  // Gérer la soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await registerUser({
        username: values.username,
        email: values.email,
        roles: values.roles,
      });

      if (result) {
        // Afficher un message de succès
        toast.success('Utilisateur créé avec succès');

        // Rediriger vers la liste des utilisateurs avec un paramètre indiquant que nous venons d'ajouter un utilisateur
        router.push('/users?fromAdd=true');
      }
    } catch (error) {
      toast.error("Erreur lors de la création de l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout title="Ajouter un utilisateur" userName={profile?.firstname || ''}>
      <Breadcrumb
        segments={[
          { name: 'Utilisateurs', href: '/users' },
          { name: 'Ajouter un utilisateur', href: '/users/add' },
        ]}
      />

      <div className="max-w-2xl mx-auto">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Ajouter un utilisateur</CardTitle>
            <CardDescription>
              Créez un nouvel utilisateur. Un email sera envoyé à l'adresse indiquée pour définir le
              mot de passe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Le nom d'utilisateur doit être unique et contenir au moins 3 caractères.
                      </FormDescription>
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
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Un email sera envoyé à cette adresse pour définir le mot de passe.
                      </FormDescription>
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
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/users">Annuler</Link>
            </Button>
            <LoadingButton
              onClick={form.handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              loadingText="Création en cours..."
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              Créer l'utilisateur
            </LoadingButton>
          </CardFooter>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
