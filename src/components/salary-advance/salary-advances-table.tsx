'use client';

import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
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
import { formatCurrency } from '@/lib/utils/currency';
import { useProfile } from '@/lib/api/hooks/use-profile';
import type { SalaryAdvanceDTO } from '@/types/salary-advance';
import { useUsers } from '@/lib/api/hooks/use-users';
import { ValidationStatusBadge } from '@/components/common/validation-status-badge';
import { ValidationActions } from '@/components/common/validation-actions';
import { useSalaryAdvanceMutations } from '@/lib/api/hooks/use-salary-advances';

interface SalaryAdvancesTableProps {
  advances: SalaryAdvanceDTO[];
  onEdit?: (advance: SalaryAdvanceDTO) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function SalaryAdvancesTable({
  advances,
  onEdit,
  onDelete,
  isLoading,
}: SalaryAdvancesTableProps) {
  const { profile } = useProfile();
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });
  const { validateAsAdmin, validateAsSuperAdmin, rejectAdvance } = useSalaryAdvanceMutations();

  const canModify = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

  const handleValidateAsAdmin = (id: string, validatorId: string) => {
    validateAsAdmin.mutate({ id, validatorId });
  };

  const handleValidateAsSuperAdmin = (id: string, validatorId: string) => {
    validateAsSuperAdmin.mutate({ id, validatorId });
  };

  const handleReject = (id: string, reason: string) => {
    rejectAdvance.mutate({ id, reason });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (advances.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune demande d'avance trouvée</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Date souhaitée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de demande</TableHead>
              {canModify && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {advances.map((advance) => {
              const employee = usersData?.items?.find(
                (user: any) => user.id === advance.employeeId
              );
              const employeeName = employee
                ? employee.firstName && employee.lastName
                  ? `${employee.firstName} ${employee.lastName}`
                  : employee.username
                : `Employé ${advance.employeeId.slice(0, 8)}...`;

              return (
                <TableRow key={advance.id}>
                  <TableCell className="font-medium">{employeeName}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(advance.amount)}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={advance.reason}>
                      {advance.reason}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(advance.requestedDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <ValidationStatusBadge status={advance.status} />
                    {advance.rejectedReason && (
                      <div className="text-xs text-red-600 mt-1" title={advance.rejectedReason}>
                        Motif: {advance.rejectedReason.substring(0, 30)}...
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{new Date(advance.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                  {canModify && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(advance)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(advance.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Actions de validation pour chaque avance */}
      <div className="space-y-4">
        {advances.map((advance) => {
          const employee = usersData?.items?.find((user: any) => user.id === advance.employeeId);
          const employeeName = employee
            ? employee.firstName && employee.lastName
              ? `${employee.firstName} ${employee.lastName}`
              : employee.username
            : `Employé ${advance.employeeId.slice(0, 8)}...`;

          return (
            <div
              key={`validation-${advance.id}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="font-medium">{employeeName}</span>
                <span className="text-gray-600">{formatCurrency(advance.amount)}</span>
                <span className="text-sm text-gray-500">{advance.reason}</span>
                <ValidationStatusBadge status={advance.status} />
              </div>
              <ValidationActions
                itemId={advance.id}
                currentStatus={advance.status}
                onValidateAsAdmin={handleValidateAsAdmin}
                onValidateAsSuperAdmin={handleValidateAsSuperAdmin}
                onReject={handleReject}
                isLoading={
                  validateAsAdmin.isPending ||
                  validateAsSuperAdmin.isPending ||
                  rejectAdvance.isPending
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
