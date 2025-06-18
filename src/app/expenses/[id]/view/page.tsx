'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUsers } from '@/lib/api/hooks/use-users';
import { ExpenseView } from '@/components/expense/expense-view';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useExpense } from '@/lib/api/hooks/use-expenses';

export default function ExpenseViewPage() {
  const params = useParams();
  const router = useRouter();
  const expenseId = params.id as string;

  const { data: expense, isLoading: isExpenseLoading, error } = useExpense(expenseId);
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  const handleEdit = () => {
    router.push(`/expenses/${expenseId}/edit`);
  };

  const handleBack = () => {
    router.push('/expenses');
  };

  // Trouver le nom de l'employé
  const employee = usersData?.items?.find((user: any) => user.id === expense?.employeeId);
  const employeeName = employee
    ? `${employee.firstName ?? '-'} ${employee.lastName ?? '-'}`
    : undefined;

  if (isExpenseLoading) {
    return (
      <AuthenticatedLayout title="Chargement...">
        <div className="container mx-auto py-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-12 w-32" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error || !expense) {
    return (
      <AuthenticatedLayout title="Erreur">
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Dépense non trouvée</h2>
              <p className="text-gray-600 mb-4">
                La dépense demandée n'existe pas ou vous n'avez pas les permissions pour la
                consulter.
              </p>
              <button onClick={handleBack} className="text-blue-600 hover:text-blue-800 underline">
                Retour à la liste des dépenses
              </button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title={`Dépense - ${expense.amount} FCFA`}>
      <Breadcrumb
        segments={[
          { name: 'Dépenses', href: '/expenses' },
          { name: 'Détails', href: `/expenses/${expenseId}/view` },
        ]}
      />
      <div className="container mx-auto py-6">
        <ExpenseView
          expense={expense}
          onEdit={handleEdit}
          onBack={handleBack}
          employeeName={employeeName}
        />
      </div>
    </AuthenticatedLayout>
  );
}
