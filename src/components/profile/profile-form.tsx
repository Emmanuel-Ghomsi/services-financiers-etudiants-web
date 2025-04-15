'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
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
import { LoadingButton } from '@/components/ui/loading-button';
import { useUpdateProfile } from '@/lib/api/hooks/use-profile-mutations';
import { UpdateUserRequestSchema, type UpdateUserRequest } from '@/lib/validators/profile';
import type { UserProfile } from '@/lib/api/hooks/use-profile';

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm<UpdateUserRequest>({
    resolver: zodResolver(UpdateUserRequestSchema),
    defaultValues: {
      firstname: profile.firstname || '',
      lastname: profile.lastname || '',
      phone: profile.phone || '',
      address: profile.address || '',
    },
  });

  const onSubmit = (values: UpdateUserRequest) => {
    updateProfile(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>Modifiez vos informations personnelles</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <Input value={profile.username} disabled className="bg-gray-100" />
              </div>
              <div>
                <FormLabel>Email</FormLabel>
                <Input value={profile.email} disabled className="bg-gray-100" />
              </div>
            </div>

            <div>
              <FormLabel>Rôles</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.roles.map((role) => (
                  <div
                    key={role}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {role}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <LoadingButton
          onClick={form.handleSubmit(onSubmit)}
          isLoading={isPending}
          loadingText="Enregistrement..."
          className="ml-auto"
        >
          Enregistrer
        </LoadingButton>
      </CardFooter>
    </Card>
  );
}
