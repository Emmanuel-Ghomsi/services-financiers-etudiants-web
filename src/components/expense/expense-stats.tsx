'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useExpenseStats, useFilteredExpenses } from '@/lib/api/hooks/use-expenses';
import { EXPENSE_CATEGORY_GROUP_LABELS } from '@/lib/constants/expense-categories';
import { formatCurrency } from '@/lib/utils/currency';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const MONTHS = [
  { value: 'all', label: "Toute l'année" },
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
];

export function ExpenseStats() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('all');

  const { data: yearStats, isLoading: isYearLoading } = useExpenseStats({ year: selectedYear });

  // Filtres pour les données mensuelles
  const monthFilters =
    selectedMonth !== 'all'
      ? {
          startDate: `${selectedYear}-${selectedMonth}-01`,
          endDate: `${selectedYear}-${selectedMonth}-31`,
        }
      : {};

  const { data: monthlyExpenses, isLoading: isMonthLoading } = useFilteredExpenses(monthFilters);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Données pour l'évolution mensuelle (toujours sur l'année)
  const monthlyData = yearStats
    ? Object.entries(yearStats.monthlyTotals).map(([month, total]) => ({
        month: `${month}/${selectedYear}`,
        total,
        fill: selectedMonth === 'all' || selectedMonth === month ? '#8884d8' : '#d1d5db',
      }))
    : [];

  // Données pour la répartition par catégorie (selon le mois sélectionné)
  const categoryData =
    selectedMonth === 'all' && yearStats
      ? Object.entries(yearStats.byCategory).map(([category, total]) => ({
          name:
            EXPENSE_CATEGORY_GROUP_LABELS[category as keyof typeof EXPENSE_CATEGORY_GROUP_LABELS] ||
            category,
          value: total,
        }))
      : monthlyExpenses
      ? (() => {
          const categoryTotals: Record<string, number> = {};
          monthlyExpenses.forEach((expense) => {
            const group = expense.group;
            categoryTotals[group] = (categoryTotals[group] || 0) + expense.amount;
          });
          return Object.entries(categoryTotals).map(([category, total]) => ({
            name:
              EXPENSE_CATEGORY_GROUP_LABELS[
                category as keyof typeof EXPENSE_CATEGORY_GROUP_LABELS
              ] || category,
            value: total,
          }));
        })()
      : [];

  // Calcul des totaux selon la période sélectionnée
  const totalAmount =
    selectedMonth === 'all'
      ? yearStats?.totalYear || 0
      : monthlyExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  const averageAmount = selectedMonth === 'all' ? (yearStats?.totalYear || 0) / 12 : totalAmount;

  const periodLabel =
    selectedMonth === 'all'
      ? `Année ${selectedYear}`
      : `${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`;

  if (isYearLoading || isMonthLoading) {
    return (
      <div className="space-y-4">
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Statistiques des dépenses</h2>
        <div className="flex gap-4">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total - {periodLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedMonth === 'all' ? 'Moyenne mensuelle' : 'Montant du mois'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(averageAmount)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nombre de catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{categoryData.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Évolution mensuelle {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <div className="h-96 overflow-auto border rounded-lg p-2">
              <div className="min-w-[600px] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} width={80} />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value as number), 'Montant']}
                      labelStyle={{ color: '#000' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Répartition par catégorie - {periodLabel}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <div className="h-96 overflow-auto border rounded-lg p-2">
              {categoryData.length > 0 ? (
                <div className="min-w-[400px] h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent, value }) =>
                          percent > 5 ? `${name}\n${(percent * 100).toFixed(0)}%` : ''
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [formatCurrency(value as number), 'Montant']}
                        labelStyle={{ color: '#000' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <p className="text-lg font-medium">Aucune donnée</p>
                    <p className="text-sm">Aucune dépense trouvée pour cette période</p>
                  </div>
                </div>
              )}
            </div>

            {/* Légende scrollable pour les catégories */}
            {categoryData.length > 0 && (
              <div className="mt-4 max-h-32 overflow-y-auto border-t pt-4">
                <div className="grid grid-cols-1 gap-2">
                  {categoryData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="flex-1 truncate" title={entry.name}>
                        {entry.name}
                      </span>
                      <span className="font-medium text-right">{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
