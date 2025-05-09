import { Users, UserCheck, ShieldCheck, ClipboardCheck, CheckCircle } from 'lucide-react';
import { StatsCard } from './stats-card';
import { DashboardSuperAdminDTO } from '@/lib/api/hooks/use-dashboard-stats';

interface SuperAdminStatsProps {
  stats: DashboardSuperAdminDTO;
}

export function SuperAdminStats({ stats }: SuperAdminStatsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Statistiques Contrôle Interne</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Utilisateurs totaux"
          value={stats.totalUsers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Conseillers"
          value={stats.totalAdvisors}
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Conformité"
          value={stats.totalAdmins}
          icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Fiches en attente"
          value={stats.pendingSuperAdminValidations}
          description="En attente de validation Contrôle Interne"
          icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Fiches validées"
          value={stats.totalValidatedFiles}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
