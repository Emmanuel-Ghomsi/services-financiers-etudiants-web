'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSalary, useSalaryMutations } from '@/lib/api/hooks/use-salaries';
import { SalaryView } from '@/components/salary/salary-view';
import { SalaryForm } from '@/components/salary/salary-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import type { UpdateSalaryRequest } from '@/types/salary';
import { useUsers } from '@/lib/api/hooks/use-users';

export default function SalaryViewPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const salaryId = params.id as string;
  const { data: salary, isLoading, error } = useSalary(salaryId);
  const { updateSalary } = useSalaryMutations();
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  // Trouver le nom de l'employé
  const employee = usersData?.items?.find((user: any) => user.id === salary?.employeeId);

  const employeeName = employee
    ? employee.firstName && employee.lastName
      ? employee.firstName + ' ' + employee.lastName
      : employee.username
    : undefined;

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleUpdateSalary = (data: UpdateSalaryRequest) => {
    updateSalary.mutate(
      { id: salaryId, data },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout title="Chargement...">
        <div className="container mx-auto py-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error || !salary) {
    return (
      <AuthenticatedLayout title="Erreur">
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Fiche de salaire non trouvée</h1>
            <p className="text-gray-600 mt-2">
              La fiche de salaire demandée n'existe pas ou vous n'avez pas les droits pour la
              consulter.
            </p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Détail de la fiche de salaire">
      <Breadcrumb
        segments={[
          { name: 'Salaires', href: '/salaries' },
          { name: 'Détail', href: `/salaries/${salaryId}/view` },
        ]}
      />
      <div className="container mx-auto py-6">
        <SalaryView salary={salary} onEdit={handleEdit} employeeName={employeeName} />

        <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier la fiche de salaire</DialogTitle>
            </DialogHeader>
            <SalaryForm
              salary={salary}
              onSubmit={handleUpdateSalary}
              onCancel={handleCloseEdit}
              isLoading={updateSalary.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
