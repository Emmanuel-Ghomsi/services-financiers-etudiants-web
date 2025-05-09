'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { toast } from 'sonner';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Déconnecter l'utilisateur et rediriger vers la page de connexion immédiatement
  useEffect(() => {
    const handleAuthError = async () => {
      // Déconnecter l'utilisateur immédiatement
      await signOut({ redirect: false });

      // Afficher un message
      toast.error(getErrorMessage());

      // Rediriger vers la page de connexion
      router.push('/auth/login');
    };

    // Exécuter la déconnexion dès le chargement de la page
    handleAuthError();
  }, [error, router]);

  // Déterminer le message d'erreur à afficher
  const getErrorMessage = () => {
    switch (error) {
      case 'RefreshAccessTokenError':
        return 'Votre session a expiré. Veuillez vous reconnecter.';
      case 'RefreshTokenExpired':
        return 'Votre session a expiré. Veuillez vous reconnecter.';
      case 'CredentialsSignin':
        return "Identifiants incorrects. Veuillez vérifier votre nom d'utilisateur et votre mot de passe.";
      case 'SessionRequired':
        return 'Vous devez être connecté pour accéder à cette page.';
      default:
        return "Une erreur s'est produite lors de l'authentification. Veuillez réessayer.";
    }
  };

  // Cette page ne sera affichée que brièvement avant la redirection
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
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Redirection en cours...</CardTitle>
            <CardDescription>Vous allez être redirigé vers la page de connexion.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">{getErrorMessage()}</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
              <p className="text-sm text-gray-500 mt-4">Redirection vers la page de connexion...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
