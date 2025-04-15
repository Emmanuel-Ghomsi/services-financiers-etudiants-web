'use client';

import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SetPasswordSuccessPage() {
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
          <CardTitle className="text-2xl font-bold">Mot de passe défini avec succès</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Votre mot de passe a été défini avec succès. Vous pouvez maintenant vous connecter à
            l'application.
          </p>
          <p className="text-gray-600">
            Utilisez votre nom d'utilisateur ou votre adresse email et le mot de passe que vous
            venez de définir pour vous connecter.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
