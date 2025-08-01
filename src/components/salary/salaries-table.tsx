'use client';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/currency';
import { PAYMENT_MODE_LABELS } from '@/lib/constants/salary-constants';
import { useSalaryPdfDownload, useSalaryMutations } from '@/lib/api/hooks/use-salaries';
import { ValidationStatus, type SalaryDTO } from '@/types/salary';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/lib/api/hooks/use-users';
import { ValidationStatusBadge } from '@/components/common/validation-status-badge';
import { ValidationActions } from '@/components/common/validation-actions';
import { useProfile } from '@/lib/api/hooks/use-profile';

interface SalariesTableProps {
  salaries: SalaryDTO[];
  onEdit: (salary: SalaryDTO) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function SalariesTable({ salaries, onEdit, onDelete, isLoading }: SalariesTableProps) {
  const router = useRouter();
  const { downloadPdf, isDownloading } = useSalaryPdfDownload();
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });
  const { validateAsAdmin, validateAsSuperAdmin, rejectSalary } = useSalaryMutations();
  const { profile } = useProfile();

  const handleView = (id: string) => {
    router.push(`/salaries/${id}/view`);
  };

  const handleDownload = (id: string) => {
    downloadPdf(id);
  };

  const handleValidateAsAdmin = (id: string, validatorId: string) => {
    validateAsAdmin.mutate({ id, validatorId });
  };

  const handleValidateAsSuperAdmin = (id: string, validatorId: string) => {
    validateAsSuperAdmin.mutate({ id, validatorId });
  };

  const handleReject = (id: string, reason: string) => {
    rejectSalary.mutate({ id, reason });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (salaries.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune fiche de salaire trouvée</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Salaire brut</TableHead>
              <TableHead>Déductions</TableHead>
              <TableHead>Avances</TableHead>
              <TableHead>Salaire net</TableHead>
              <TableHead>Mode de paiement</TableHead>
              <TableHead>Date de paiement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.map((salary) => {
              const employee = usersData?.items?.find(
                (user: any) => user.id === salary?.employeeId
              );
              const employeeName = employee
                ? employee.firstName && employee.lastName
                  ? `${employee.firstName} ${employee.lastName}`
                  : employee.username
                : `Employé ${salary.employeeId.slice(0, 8)}...`;

              return (
                <TableRow key={salary.id}>
                  <TableCell className="font-medium">{employeeName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {salary.month}/{salary.year}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(salary.grossSalary)}</TableCell>
                  <TableCell className="text-red-600">
                    -{formatCurrency(salary.deductions)}
                  </TableCell>
                  <TableCell className="text-red-600">-{formatCurrency(salary.advances)}</TableCell>
                  <TableCell className="font-medium">
                    <span className={salary.netSalary >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(salary.netSalary)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {PAYMENT_MODE_LABELS[salary.paymentMode as keyof typeof PAYMENT_MODE_LABELS]}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(salary.paymentDate).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <ValidationStatusBadge status={salary.status} />
                    {salary.rejectedReason && (
                      <div className="text-xs text-red-600 mt-1" title={salary.rejectedReason}>
                        Motif: {salary.rejectedReason.substring(0, 30)}...
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(salary.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          {salary.creatorId === profile?.id &&
                            (salary.status === ValidationStatus.AWAITING_ADMIN_VALIDATION ||
                              salary.status === ValidationStatus.REJECTED) && (
                              <DropdownMenuItem onClick={() => onEdit(salary)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                          {salary.creatorId === profile?.id && (
                            <DropdownMenuItem
                              onClick={() => onDelete(salary.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Actions de validation pour chaque salaire */}
      <div className="space-y-4">
        {salaries.map((salary) => {
          const employee = usersData?.items?.find((user: any) => user.id === salary?.employeeId);
          const employeeName = employee
            ? employee.firstName && employee.lastName
              ? `${employee.firstName} ${employee.lastName}`
              : employee.username
            : `Employé ${salary.employeeId.slice(0, 8)}...`;

          return (
            <div
              key={`validation-${salary.id}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="font-medium">{employeeName}</span>
                <Badge variant="outline">
                  {salary.month}/{salary.year}
                </Badge>
                <span className="text-gray-600">{formatCurrency(salary.netSalary)}</span>
                <ValidationStatusBadge status={salary.status} />
              </div>
              <ValidationActions
                itemId={salary.id}
                status={salary.status}
                onValidateAsAdmin={handleValidateAsAdmin}
                onValidateAsSuperAdmin={handleValidateAsSuperAdmin}
                onReject={handleReject}
                isLoading={
                  validateAsAdmin.isPending ||
                  validateAsSuperAdmin.isPending ||
                  rejectSalary.isPending
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
