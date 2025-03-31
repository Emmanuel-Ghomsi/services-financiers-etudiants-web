import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center flex flex-col">
        <Logo />
        <h1 className="text-4xl font-bold mt-10 mb-6 text-brand-blue">
          Services Financiers Étudiants
        </h1>
        <p className="text-xl mb-8 text-gray-600">Application de gestion des clients KYC</p>
        <Button className="bg-brand-blue hover:bg-brand-blue/90" asChild>
          <Link href="/auth/login">Connexion</Link>
        </Button>
      </div>
    </main>
  );
}
