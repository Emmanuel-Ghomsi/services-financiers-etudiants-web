'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ForgotPasswordConfirmationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  async function handleResendEmail() {
    if (!email) {
      toast('Aucune adresse email spécifiée', 'error');
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }

      toast('Un nouveau lien de réinitialisation a été envoyé à votre adresse email', 'success');
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi",
        'error'
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
      <div className="flex flex-col items-center mb-10">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Email envoyé</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Si l'adresse <span className="font-medium">{email}</span> est associée à un compte, vous
            allez recevoir un email contenant un lien de réinitialisation de mot de passe.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800 flex">
            <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>
              Vérifiez votre boîte de réception ainsi que vos dossiers de spam et courrier
              indésirable.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="w-full"
            disabled={isResending}
          >
            {isResending ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Renvoyer l'email"}
          </Button>
          <Button asChild className="w-full bg-brand-blue hover:bg-brand-blue/90">
            <Link href="/auth/login">Retour à la connexion</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
