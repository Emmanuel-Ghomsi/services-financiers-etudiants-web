'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/expense/expense-form';
import { ExpensesTable } from '@/components/expense/expenses-table';
import { ExpenseFilters } from '@/components/expense/expense-filters';
import { ExpenseStats } from '@/components/expense/expense-stats';
import {
  useExpenses,
  useFilteredExpenses,
  useExpenseMutations,
} from '@/lib/api/hooks/use-expenses';
import type {
  ExpenseDTO,
  ExpenseFilterRequest,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from '@/types/expense';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function ExpensesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseDTO | null>(null);
  const [filters, setFilters] = useState<ExpenseFilterRequest>({});
  const [hasFilters, setHasFilters] = useState(false);

  const limit = 10;

  // Utiliser les dépenses filtrées si des filtres sont appliqués, sinon les dépenses paginées
  const { data: expensesData, isLoading } = useExpenses({
    page: hasFilters ? 1 : currentPage,
    limit,
  });

  const { data: filteredExpenses, isLoading: isFilterLoading } = useFilteredExpenses({
    ...filters,
    page: currentPage,
    limit,
  });

  const { createExpense, updateExpense, deleteExpense } = useExpenseMutations();

  const currentData = hasFilters ? filteredExpenses : expensesData?.items;
  const currentTotal = hasFilters ? filteredExpenses?.length || 0 : expensesData?.total || 0;
  const currentTotalPages = hasFilters
    ? Math.ceil(currentTotal / limit)
    : expensesData?.totalPages || 1;

  const currentLoading = hasFilters ? isFilterLoading : isLoading;

  const handleCreateExpense = (data: CreateExpenseRequest | UpdateExpenseRequest, file?: File) => {
    createExpense.mutate(
      { data: data as CreateExpenseRequest, file },
      {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      }
    );
  };

  const handleUpdateExpense = (data: CreateExpenseRequest | UpdateExpenseRequest, file?: File) => {
    if (editingExpense) {
      updateExpense.mutate(
        { id: editingExpense.id, data: data as UpdateExpenseRequest, file },
        {
          onSuccess: () => {
            setEditingExpense(null);
            setIsFormOpen(false);
          },
        }
      );
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      deleteExpense.mutate(id);
    }
  };

  const handleEditExpense = (expense: ExpenseDTO) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleFilter = (newFilters: ExpenseFilterRequest) => {
    setFilters(newFilters);
    setHasFilters(Object.values(newFilters).some((value) => value !== undefined && value !== ''));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setHasFilters(false);
    setCurrentPage(1);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <AuthenticatedLayout title="Dépenses">
      <Breadcrumb segments={[{ name: 'Dépenses', href: '/expenses' }]} />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion des dépenses</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une dépense
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Liste des dépenses</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dépenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ExpenseFilters onFilter={handleFilter} onReset={handleResetFilters} />

                <ExpensesTable
                  expenses={currentData || []}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                  isLoading={currentLoading}
                />

                {(expensesData || hasFilters) && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} sur {currentTotalPages}
                      {hasFilters && ` (${currentTotal} résultats filtrés)`}
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
                        onClick={() => setCurrentPage(Math.min(currentTotalPages, currentPage + 1))}
                        disabled={currentPage === currentTotalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <ExpenseStats />
          </TabsContent>
        </Tabs>

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? 'Modifier la dépense' : 'Ajouter une dépense'}
              </DialogTitle>
            </DialogHeader>
            <ExpenseForm
              expense={editingExpense || undefined}
              onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
              onCancel={handleCloseForm}
              isLoading={createExpense.isPending || updateExpense.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
