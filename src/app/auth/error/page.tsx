'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mapping des codes d'erreur vers des messages utilisateur
const errorMessages: Record<string, string> = {
  CredentialsSignin:
    "Identifiants incorrects. Veuillez vérifier votre nom d'utilisateur et mot de passe.",
  SessionRequired: 'Vous devez être connecté pour accéder à cette page.',
  AccessDenied: "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.",
  RefreshAccessTokenError: 'Votre session a expiré. Veuillez vous reconnecter.',
  RefreshTokenExpired: 'Votre session a expiré. Veuillez vous reconnecter.',
  OAuthAccountNotLinked: 'Ce compte est déjà lié à un autre utilisateur.',
  OAuthSignInError: 'Erreur lors de la connexion avec le fournisseur externe.',
  OAuthCallbackError: 'Erreur lors de la connexion avec le fournisseur externe.',
  default: "Une erreur est survenue lors de l'authentification. Veuillez réessayer.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error && errorMessages[error]) {
      setErrorMessage(errorMessages[error]);
    } else {
      setErrorMessage(errorMessages.default);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-blue">
      <div className="flex flex-col items-center mb-10">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Erreur d'authentification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">{errorMessage}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
            <p>Si le problème persiste, veuillez contacter le support technique.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
            <Link href="/login">Retour à la connexion</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
