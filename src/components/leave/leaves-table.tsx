'use client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { type LeaveDTO, type LeaveType, ValidationStatus } from '@/types/leave';
import { LEAVE_TYPE_LABELS, LEAVE_TYPE_COLORS } from '@/lib/constants/leave-constants';
import { ValidationStatusBadge } from '@/components/common/validation-status-badge';
import { ValidationActions } from '@/components/common/validation-actions';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useUsers } from '@/lib/api/hooks/use-users';

interface LeavesTableProps {
  leaves: LeaveDTO[];
  onView: (leave: LeaveDTO) => void;
  onEdit: (leave: LeaveDTO) => void;
  onDelete: (id: string) => void;
  onValidateAdmin: (id: string) => void;
  onValidateSuperAdmin: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isLoading: boolean;
}

export function LeavesTable({
  leaves,
  onView,
  onEdit,
  onDelete,
  onValidateAdmin,
  onValidateSuperAdmin,
  onReject,
  isLoading,
}: LeavesTableProps) {
  const { profile } = useProfile();

  // Vérifier les permissions
  const canAccessUsers = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN'].includes(role.toUpperCase())
  );
  const isAdmin = profile?.roles?.some((role) => role.toUpperCase() === 'ADMIN') ?? false;
  const isSuperAdmin =
    profile?.roles?.some((role) => role.toUpperCase() === 'SUPER_ADMIN') ?? false;
  const canValidate = isAdmin || isSuperAdmin;

  const { data: usersData } = useUsers({ page: 1, pageSize: 100 }, { enabled: canAccessUsers });

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  if (leaves.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Aucune demande de congé trouvée.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demandes de congé</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de demande</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => {
                const employee = usersData?.items?.find(
                  (user: any) => user.id === leave?.employeeId
                );
                const employeeName = employee
                  ? employee.firstName && employee.lastName
                    ? `${employee.firstName} ${employee.lastName}`
                    : employee.username
                  : profile?.username;

                return (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{employeeName}</TableCell>
                    <TableCell>
                      <Badge className={LEAVE_TYPE_COLORS[leave.leaveType as LeaveType]}>
                        {LEAVE_TYPE_LABELS[leave.leaveType as LeaveType]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          Du {format(new Date(leave.startDate), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                        <div>
                          Au {format(new Date(leave.endDate), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{calculateDays(leave.startDate, leave.endDate)} jour(s)</TableCell>
                    <TableCell>
                      <ValidationStatusBadge status={leave.status} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(leave.createdAt), 'dd/MM/yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {/* Actions de validation */}
                        {canValidate && (
                          <ValidationActions
                            itemId={leave.id}
                            status={leave.status}
                            onValidateAsAdmin={() => onValidateAdmin(leave.id)}
                            onValidateAsSuperAdmin={() => onValidateSuperAdmin(leave.id)}
                            onReject={(reason) => onReject(leave.id, reason)}
                            isLoading={isLoading}
                          />
                        )}

                        {/* Menu d'actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(leave)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            {leave.reviewedBy === profile?.id &&
                              (leave.status === ValidationStatus.AWAITING_ADMIN_VALIDATION ||
                                leave.status === ValidationStatus.REJECTED) && (
                                <DropdownMenuItem onClick={() => onEdit(leave)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                              )}
                            {leave.reviewedBy === profile?.id && (
                              <DropdownMenuItem
                                onClick={() => onDelete(leave.id)}
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
      </CardContent>
    </Card>
  );
}
