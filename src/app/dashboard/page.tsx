'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useDashboardStats } from '@/lib/api/hooks/use-multi-role-dashboard-stats';
import { SuperAdminStats } from '@/components/dashboard/super-admin-stats';
import { AdminStats } from '@/components/dashboard/admin-stats';
import { AdvisorStats } from '@/components/dashboard/advisor-stats';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SalaryWidgets } from '@/components/dashboard/salary-widgets';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { profile, isLoading: profileLoading } = useProfile();
  const {
    data: dashboardData,
    isLoading: statsLoading,
    isSuperAdmin,
    isAdmin,
    isAdvisor,
    rawData,
  } = useDashboardStats();

  const router = useRouter();

  // Vérifier si l'utilisateur peut accéder aux widgets salaires
  const canAccessSalaryWidgets = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH', 'ACCOUNTANT'].includes(role.toUpperCase())
  );

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (status === 'loading' || profileLoading || statsLoading) {
    return (
      <AuthenticatedLayout title="Tableau de bord" userName={profile?.firstname || ''}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <span className="ml-2">Chargement des statistiques...</span>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Vérifier si les données du tableau de bord sont disponibles
  if (!rawData) {
    return (
      <AuthenticatedLayout title="Tableau de bord" userName={profile?.firstname || ''}>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              Aucune statistique disponible pour le moment.
            </div>
          </CardContent>
        </Card>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Tableau de bord" userName={profile?.firstname || ''}>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Bienvenue, {profile?.firstname || profile?.username}</h1>

        <div className="space-y-10">
          {/* Widgets salaires pour les rôles autorisés */}
          {canAccessSalaryWidgets && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Résumé financier</h2>
              <SalaryWidgets />
            </div>
          )}

          {/* Afficher les statistiques en fonction du rôle retourné par l'API */}
          {rawData.role === 'SUPER_ADMIN' && isSuperAdmin && (
            <SuperAdminStats stats={rawData.stats as any} />
          )}

          {rawData.role === 'ADMIN' && isAdmin && <AdminStats stats={rawData.stats as any} />}

          {rawData.role === 'ADVISOR' && isAdvisor && <AdvisorStats stats={rawData.stats as any} />}

          {/* Si aucune statistique n'est disponible pour les rôles de l'utilisateur */}
          {!(
            (rawData.role === 'SUPER_ADMIN' && isSuperAdmin) ||
            (rawData.role === 'ADMIN' && isAdmin) ||
            (rawData.role === 'ADVISOR' && isAdvisor)
          ) && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  Aucune statistique disponible pour votre rôle.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
