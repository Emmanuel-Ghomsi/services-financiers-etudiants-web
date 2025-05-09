import { FileText, CheckCircle } from 'lucide-react';
import { StatsCard } from './stats-card';
import { DashboardAdvisorDTO } from '@/lib/api/hooks/use-dashboard-stats';

interface AdvisorStatsProps {
  stats: DashboardAdvisorDTO;
}

export function AdvisorStats({ stats }: AdvisorStatsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Statistiques Conseiller</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatsCard
          title="Fiches créées"
          value={stats.filesCreatedByMe}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Fiches validées"
          value={stats.filesValidated}
          description="Fiches que vous avez créées qui sont validées"
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
