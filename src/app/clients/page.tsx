'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientFilesTable } from '@/components/client/client-files-table';
import { ClientFilesInfinite } from '@/components/client/client-files-infinite';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useSession } from 'next-auth/react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Loader2, PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function ClientsListPage() {
  const { data: session, status } = useSession();
  const { profile, isLoading: profileLoading } = useProfile();
  const router = useRouter();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (status === 'loading' || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-brand-blue" />
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <AuthenticatedLayout title="Clients" userName={profile?.firstName || ''}>
      <Breadcrumb segments={[{ name: 'Clients', href: '/clients' }]} />

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90" asChild>
            <span>Clients enregistrés</span>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href="/clients/new">
            <PlusIcon className="h-4 w-4" />
            <span>Ajouter un client</span>
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="standard">Pagination Standard</TabsTrigger>
          <TabsTrigger value="infinite">Chargement Infini</TabsTrigger>
        </TabsList>
        <TabsContent value="standard">
          <ClientFilesTable />
        </TabsContent>
        <TabsContent value="infinite">
          <ClientFilesInfinite />
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  );
}
