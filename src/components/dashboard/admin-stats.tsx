import { FileText, ClipboardCheck, CheckCircle } from 'lucide-react';
import { StatsCard } from './stats-card';
import { DashboardAdminDTO } from '@/lib/api/hooks/use-dashboard-stats';

interface AdminStatsProps {
  stats: DashboardAdminDTO;
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Statistiques Conformité</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Fiches créées"
          value={stats.filesCreatedByMe}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Fiches en attente"
          value={stats.pendingAdminValidations}
          description="En attente de validation Conformité"
          icon={<ClipboardCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Fiches validées par moi"
          value={stats.validatedByMe}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
