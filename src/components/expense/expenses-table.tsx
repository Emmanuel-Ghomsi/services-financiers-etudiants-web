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
import { MoreHorizontal, Edit, Trash2, FileText, Eye, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ExpenseDTO } from '@/types/expense';
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_GROUP_LABELS,
} from '@/lib/constants/expense-categories';
import { formatCurrency } from '@/lib/utils/currency';
import { useRouter } from 'next/navigation';
import { useExpenseDownload } from '@/lib/api/hooks/use-expense-download';

interface ExpensesTableProps {
  expenses: ExpenseDTO[];
  onEdit: (expense: ExpenseDTO) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ExpensesTable({ expenses, onEdit, onDelete, isLoading }: ExpensesTableProps) {
  const router = useRouter();
  const { downloadJustificatif, isDownloading } = useExpenseDownload();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
  };

  const handleView = (expense: ExpenseDTO) => {
    router.push(`/expenses/${expense.id}/view`);
  };

  const handleDownloadFile = async (expense: ExpenseDTO) => {
    if (expense.fileUrl) {
      await downloadJustificatif(expense.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune dépense trouvée</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Groupe</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Pièce jointe</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{formatDate(expense.date)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(expense.amount)}</TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate">
                  {
                    EXPENSE_CATEGORY_LABELS[
                      expense.category as keyof typeof EXPENSE_CATEGORY_LABELS
                    ]
                  }
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {
                    EXPENSE_CATEGORY_GROUP_LABELS[
                      expense.group as keyof typeof EXPENSE_CATEGORY_GROUP_LABELS
                    ]
                  }
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate">{expense.description || '-'}</div>
              </TableCell>
              <TableCell>
                {expense.fileUrl ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadFile(expense)}
                    disabled={isDownloading}
                    title="Télécharger la pièce justificative"
                  >
                    {isDownloading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </Button>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(expense)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    {expense.fileUrl && (
                      <DropdownMenuItem onClick={() => handleDownloadFile(expense)}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger le fichier
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(expense.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
