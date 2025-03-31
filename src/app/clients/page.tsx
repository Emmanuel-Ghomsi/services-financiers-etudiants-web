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
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue"></div>
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <AuthenticatedLayout title="Clients" userName={profile?.firstName || ''}>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90" asChild>
            <span>Clients enregistrés</span>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={() => router.push('/clients/new')}
        >
          <span className="text-lg">+</span>
          <span>Ajouter un client</span>
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
