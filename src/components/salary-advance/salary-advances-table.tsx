'use client';

import { Check, X, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
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
import {
  SALARY_ADVANCE_STATUS_LABELS,
  SALARY_ADVANCE_STATUS_COLORS,
} from '@/lib/constants/salary-constants';
import { useProfile } from '@/lib/api/hooks/use-profile';
import type { SalaryAdvanceDTO, SalaryAdvanceStatus } from '@/types/salary-advance';
import { useUsers } from '@/lib/api/hooks/use-users';

interface SalaryAdvancesTableProps {
  advances: SalaryAdvanceDTO[];
  onUpdateStatus: (id: string, status: SalaryAdvanceStatus) => void;
  onEdit?: (advance: SalaryAdvanceDTO) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function SalaryAdvancesTable({
  advances,
  onUpdateStatus,
  onEdit,
  onDelete,
  isLoading,
}: SalaryAdvancesTableProps) {
  const { profile } = useProfile();
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  // Vérifier si l'utilisateur peut valider les avances
  const canValidate = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

  // Vérifier si l'utilisateur peut modifier/supprimer
  const canModify = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

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
            {(canValidate || canModify) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {advances.map((advance) => {
            const employee = usersData?.items?.find((user: any) => user.id === advance?.employeeId);
            const employeeName = employee
              ? employee.firstName && employee.lastName
                ? `${employee.firstName} ${employee.lastName}`
                : employee.username
              : `Employé ${advance.employeeId.slice(0, 8)}...`;

            return (
              <TableRow key={advance.id}>
                <TableCell className="font-medium">{employeeName}</TableCell>
                <TableCell className="font-medium">{formatCurrency(advance.amount)}</TableCell>
                <TableCell className="max-w-xs truncate" title={advance.reason}>
                  {advance.reason}
                </TableCell>
                <TableCell>{new Date(advance.requestedDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <Badge
                    className={SALARY_ADVANCE_STATUS_COLORS[advance.status]}
                    variant="secondary"
                  >
                    {SALARY_ADVANCE_STATUS_LABELS[advance.status]}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(advance.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                {(canValidate || canModify) && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canModify &&
                            onEdit &&
                            advance.status == SALARY_ADVANCE_STATUS_LABELS.PENDING && (
                              <DropdownMenuItem onClick={() => onEdit(advance)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                          {canValidate && advance.status === 'PENDING' && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateStatus(advance.id, 'APPROVED' as SalaryAdvanceStatus)
                                }
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approuver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateStatus(advance.id, 'REJECTED' as SalaryAdvanceStatus)
                                }
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Rejeter
                              </DropdownMenuItem>
                            </>
                          )}
                          {canModify &&
                            onDelete &&
                            advance.status == SALARY_ADVANCE_STATUS_LABELS.PENDING && (
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
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
