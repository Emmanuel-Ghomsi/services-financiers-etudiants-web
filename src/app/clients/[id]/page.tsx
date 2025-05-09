'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useClientFile } from '@/lib/api/hooks/use-client-file';
import { Loader2 } from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const { profile } = useProfile();
  const { clientFile, isLoading } = useClientFile(clientId);

  // Rediriger vers la page d'édition
  useEffect(() => {
    if (clientFile && !isLoading) {
      router.push(`/clients/${clientId}/edit`);
    }
  }, [clientFile, clientId, isLoading, router]);

  return (
    <AuthenticatedLayout title="Redirection..." userName={profile?.firstname || ''}>
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
        <p className="mt-4 text-lg text-gray-600">Redirection vers la page d'édition...</p>
      </div>
    </AuthenticatedLayout>
  );
}
