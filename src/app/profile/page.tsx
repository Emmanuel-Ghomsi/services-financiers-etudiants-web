'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/profile/profile-form';
import { ProfilePicture } from '@/components/profile/profile-picture';
import { PasswordForm } from '@/components/profile/password-form';
import { DeleteAccountForm } from '@/components/profile/delete-account-form';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { profile, isLoading } = useProfile();
  const router = useRouter();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (status === 'loading' || isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-brand-blue" />
        <p className="mt-4 text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <AuthenticatedLayout title="Mon profil" userName={profile?.firstname || ''}>
      <Breadcrumb segments={[{ name: 'Mon profil', href: '/profile' }]} />

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="info">Informations personnelles</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="danger">Zone de danger</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <ProfilePicture profile={profile} />
              </div>
              <div className="md:col-span-2">
                <ProfileForm profile={profile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <PasswordForm />
          </TabsContent>

          <TabsContent value="danger" className="space-y-6">
            <DeleteAccountForm />
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
