'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { LoadingButton } from '@/components/ui/loading-button';
import { useChangePassword } from '@/lib/api/hooks/use-profile-mutations';
import { ChangePasswordRequestSchema, type ChangePasswordRequest } from '@/lib/validators/profile';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordRequestSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const onSubmit = (values: ChangePasswordRequest) => {
    changePassword(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier le mot de passe</CardTitle>
        <CardDescription>Définissez un nouveau mot de passe pour votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Nouveau mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormDescription>
                    Le mot de passe doit contenir au moins 8 caractères.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <LoadingButton
          onClick={form.handleSubmit(onSubmit)}
          isLoading={isPending}
          loadingText="Modification..."
          className="ml-auto"
        >
          Modifier le mot de passe
        </LoadingButton>
      </CardFooter>
    </Card>
  );
}
