'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, CreditCard, Receipt } from 'lucide-react';
import { useDashboardAdminSummary } from '@/lib/api/hooks/use-dashboard-summary';
import { formatCurrency } from '@/lib/utils/currency';

export function DashboardSummaryCards() {
  const { data: summary, isLoading } = useDashboardAdminSummary();

  if (isLoading) {
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

  if (!summary) {
    return null;
  }

  const cards = [
    {
      title: 'Total Salaires',
      value: formatCurrency(summary.totalSalaries),
      icon: Banknote,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Salaires versés',
    },
    {
      title: 'Total des Avances',
      value: summary.totalAdvances.toString(),
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Avances validées',
    },
    {
      title: 'Total des Dépenses',
      value: formatCurrency(summary.totalExpenses),
      icon: Receipt,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Dépenses validées',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
