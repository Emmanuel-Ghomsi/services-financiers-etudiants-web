'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUsers } from '@/lib/api/hooks/use-users';
import { formatCurrency } from '@/lib/utils/currency';
import type { SalaryPeriodDTO } from '@/types/salary';

interface SalaryPeriodTableProps {
  salaries: SalaryPeriodDTO[];
  isLoading?: boolean;
}

export function SalaryPeriodTable({ salaries, isLoading }: SalaryPeriodTableProps) {
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (salaries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune fiche de salaire trouvée pour cette période
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Salaire brut</TableHead>
            <TableHead>Déductions</TableHead>
            <TableHead>Avances</TableHead>
            <TableHead>Salaire net</TableHead>
            <TableHead>Date de paiement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((salary, index) => {
            const employee = usersData?.items?.find((user: any) => user.id === salary?.employeeId);
            const employeeName = employee
              ? employee.firstName && employee.lastName
                ? `${employee.firstName} ${employee.lastName}`
                : employee.username
              : `Employé ${salary.employeeId.slice(0, 8)}...`;
            return (
              <TableRow key={`${salary.employeeId}-${index}`}>
                <TableCell className="font-medium">{employeeName}</TableCell>
                <TableCell>{formatCurrency(salary.grossSalary)}</TableCell>
                <TableCell className="text-red-600">-{formatCurrency(salary.deductions)}</TableCell>
                <TableCell className="text-red-600">-{formatCurrency(salary.advances)}</TableCell>
                <TableCell className="font-medium">
                  <span className={salary.netSalary >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(salary.netSalary)}
                  </span>
                </TableCell>
                <TableCell>{new Date(salary.paymentDate).toLocaleDateString('fr-FR')}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
