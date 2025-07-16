'use client';

import { TrendingUp, Clock, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/currency';
import {
  useDashboardSummary,
  useExpenseDistribution,
  useSalaryEvolution,
} from '@/lib/api/hooks/use-dashboard-summary';

export function SalaryWidgets() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: evolution, isLoading: evolutionLoading } = useSalaryEvolution(
    new Date().getFullYear().toString()
  );
  const { data: distribution, isLoading: distributionLoading } = useExpenseDistribution({
    year: new Date().getFullYear().toString(),
    month: new Date().getMonth().toString(),
  });

  if (summaryLoading || evolutionLoading || distributionLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentMonth = evolution?.[evolution.length - 1]?.total || 0;
  const previousMonth = evolution?.[evolution.length - 2]?.total || 0;
  const salaryTrend = currentMonth > previousMonth ? 'up' : 'down';
  const salaryChange =
    previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total des salaires versés */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Salaires du mois</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary?.totalSalaries || 0)}</div>
          <p className="text-xs text-muted-foreground">
            <span
              className={`inline-flex items-center ${
                salaryTrend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.abs(salaryChange).toFixed(1)}%
            </span>{' '}
            par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      {/* Avances en attente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avances en attente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.pendingAdvances || 0}</div>
          <p className="text-xs text-muted-foreground">Demandes à valider</p>
        </CardContent>
      </Card>

      {/* Dépenses du mois */}
      {distribution
        ? distribution.map((expense) => (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dépenses du mois</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(expense.amount || 0)}</div>
                <p className="text-xs text-muted-foreground">{expense.category}</p>
              </CardContent>
            </Card>
          ))
        : null}

      {/* Congés actifs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Congés actifs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary?.activeLeaves || 0}</div>
          <p className="text-xs text-muted-foreground">Employés en congé</p>
        </CardContent>
      </Card>
    </div>
  );
}
