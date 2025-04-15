'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Si l'utilisateur est connecté, rediriger vers le tableau de bord
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
    // Si le statut est "loading", on attend la résolution
  }, [status, router]);

  // Si l'utilisateur n'est pas connecté, afficher la page d'accueil avec le fond bleu dégradé
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Services Financiers Étudiants"
                width={150}
                height={80}
                className="mr-4"
              />
            </div>
            <div>
              <Link
                href="/auth/login"
                className="bg-brand-blue text-white px-6 py-2 rounded-md hover:bg-brand-blue-light transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-20">
            <h1 className="text-4xl font-bold text-brand-blue mb-6 text-center">
              Services Financiers Étudiants
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl text-center mb-8">
              Plateforme de gestion des clients et des services financiers pour les étudiants.
            </p>
            <Link
              href="/auth/login"
              className="bg-brand-blue text-white px-8 py-3 rounded-md text-lg hover:bg-brand-blue-light transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
      <div className="text-center">
        <Image
          src="/images/logo.png"
          alt="Services Financiers Étudiants"
          width={200}
          height={100}
          className="mx-auto mb-8"
        />
        <Loader2 className="h-16 w-16 animate-spin text-brand-blue mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2 text-brand-blue">
          Services Financiers Étudiants
        </h1>
        <p className="text-gray-700">Redirection en cours...</p>
      </div>
    </div>
  );
}
