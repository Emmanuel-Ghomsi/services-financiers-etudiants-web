'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

// Schéma de validation pour le formulaire
const formSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Gérer les erreurs d'authentification
  useEffect(() => {
    // Si l'erreur est liée à un token expiré, déconnecter l'utilisateur
    if (error === 'RefreshTokenExpired' || error === 'RefreshAccessTokenError') {
      const handleExpiredToken = async () => {
        // Déconnecter l'utilisateur
        await signOut({ redirect: false });

        // Afficher un message d'erreur
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
      };

      handleExpiredToken();
    } else if (error) {
      // Gérer les autres erreurs
      let errorMessage = "Une erreur s'est produite lors de l'authentification.";

      switch (error) {
        case 'CredentialsSignin':
          errorMessage =
            "Identifiants incorrects. Veuillez vérifier votre nom d'utilisateur et votre mot de passe.";
          break;
        case 'SessionRequired':
          errorMessage = 'Vous devez être connecté pour accéder à cette page.';
          break;
        default:
          errorMessage = `Erreur: ${error}`;
      }

      toast.error(errorMessage);
    }
  }, [error]);

  // Rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  useEffect(() => {
    if (status === 'authenticated' && !error) {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl, error]);

  // Initialiser le formulaire
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Gérer la soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        // Gérer l'erreur localement au lieu de rediriger
        let errorMessage = 'Identifiants incorrects. Veuillez réessayer.';

        switch (result.error) {
          case 'CredentialsSignin':
            errorMessage =
              "Identifiants incorrects. Veuillez vérifier votre nom d'utilisateur et votre mot de passe.";
            break;
          default:
            errorMessage = `Erreur: ${result.error}`;
        }

        toast.error(errorMessage);
      } else if (result?.url) {
        // Redirection manuelle vers l'URL de callback
        router.push(result.url);
      } else {
        // Fallback à la redirection par défaut
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Si le statut est "loading", afficher un indicateur de chargement
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="Services Financiers Étudiants"
            width={150}
            height={80}
            className="mx-auto mb-6"
          />
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Services Financiers Étudiants"
            width={150}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-brand-blue">Services Financiers Étudiants</h1>
          <p className="text-gray-700 mt-2">Connectez-vous à votre compte</p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à votre compte.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
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
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                          </span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoadingButton
                  type="submit"
                  className="w-full bg-brand-blue hover:bg-brand-blue/90"
                  isLoading={isLoading}
                  loadingText="Connexion en cours..."
                >
                  Se connecter
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="link" className="text-sm" asChild>
              <a href="/auth/forgot-password">Mot de passe oublié ?</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
