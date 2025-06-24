'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SalaryForm } from '@/components/salary/salary-form';
import { SalariesTable } from '@/components/salary/salaries-table';
import {
  useSalaries,
  useSalariesByPeriodPaginated,
  useSalaryMutations,
} from '@/lib/api/hooks/use-salaries';
import { MONTHS, CURRENT_YEAR } from '@/lib/constants/salary-constants';
import type { SalaryDTO, CreateSalaryRequest, UpdateSalaryRequest } from '@/types/salary';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { SalaryPeriodTable } from '@/components/salary/salary-period-table';

export default function SalariesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryDTO | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [activeTab, setActiveTab] = useState('all');

  const limit = 10;

  // Hook pour toutes les fiches de salaire
  const { data: allSalariesData, isLoading: allSalariesLoading } = useSalaries({
    page: currentPage,
    limit,
  });

  // Hook pour les fiches par période
  const { data: periodSalariesData, isLoading: periodSalariesLoading } =
    useSalariesByPeriodPaginated({
      month: selectedMonth,
      year: selectedYear,
      page: currentPage,
      limit,
    });

  const { createSalary, updateSalary, deleteSalary } = useSalaryMutations();

  // Données pour l'onglet "all"
  const allSalaries = allSalariesData?.items || [];
  const allSalariesPagination = allSalariesData;

  // Données pour l'onglet "period"
  const periodSalaries = periodSalariesData?.items || [];
  const periodSalariesPagination = periodSalariesData;

  const handleCreateSalary = (data: CreateSalaryRequest | UpdateSalaryRequest) => {
    createSalary.mutate(data as CreateSalaryRequest, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleUpdateSalary = (data: CreateSalaryRequest | UpdateSalaryRequest) => {
    if (editingSalary) {
      updateSalary.mutate(
        { id: editingSalary.id, data: data as UpdateSalaryRequest },
        {
          onSuccess: () => {
            setEditingSalary(null);
            setIsFormOpen(false);
          },
        }
      );
    }
  };

  const handleDeleteSalary = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fiche de salaire ?')) {
      deleteSalary.mutate(id);
    }
  };

  const handleEditSalary = (salary: SalaryDTO) => {
    setEditingSalary(salary);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSalary(null);
  };

  return (
    <AuthenticatedLayout title="Salaires">
      <Breadcrumb segments={[{ name: 'Salaires', href: '/salaries' }]} />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion des salaires</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Créer une fiche de salaire
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Toutes les fiches</TabsTrigger>
            <TabsTrigger value="period">Par période</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les fiches de salaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SalariesTable
                  salaries={allSalaries}
                  onEdit={handleEditSalary}
                  onDelete={handleDeleteSalary}
                  isLoading={allSalariesLoading}
                />

                {allSalariesPagination && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} sur {allSalariesPagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(
                            Math.min(allSalariesPagination.totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === allSalariesPagination.totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="period" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fiches de salaire par période</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Select
                      value={selectedMonth.toString()}
                      onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un mois" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une année" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <SalaryPeriodTable salaries={periodSalaries} isLoading={periodSalariesLoading} />

                {periodSalariesPagination && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} sur {periodSalariesPagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(
                            Math.min(periodSalariesPagination.totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === periodSalariesPagination.totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSalary ? 'Modifier la fiche de salaire' : 'Créer une fiche de salaire'}
              </DialogTitle>
            </DialogHeader>
            <SalaryForm
              salary={editingSalary || undefined}
              onSubmit={editingSalary ? handleUpdateSalary : handleCreateSalary}
              onCancel={handleCloseForm}
              isLoading={createSalary.isPending || updateSalary.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
