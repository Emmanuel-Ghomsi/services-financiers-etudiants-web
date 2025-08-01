'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, User, Tag, DollarSign, Edit, ArrowLeft, Eye } from 'lucide-react';
import type { ExpenseDTO } from '@/types/expense';
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_GROUP_LABELS,
} from '@/lib/constants/expense-categories';
import { formatCurrency } from '@/lib/utils/currency';
import { useState } from 'react';
import { DocumentViewer } from './document-viewer';

interface ExpenseViewProps {
  expense: ExpenseDTO;
  onEdit?: () => void;
  onBack?: () => void;
  employeeName?: string;
}

export function ExpenseView({ expense, onEdit, onBack, employeeName }: ExpenseViewProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };

  const handleViewDocument = () => {
    setIsViewerOpen(true);
  };

  // Extraire le nom du fichier de l'URL
  const getFileName = (fileUrl: string) => {
    const parts = fileUrl.split('/');
    return parts[parts.length - 1] || 'document';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Détails de la dépense</h1>
            <p className="text-gray-600">Créée le {formatDateTime(expense.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informations financières
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Montant</label>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de la dépense</label>
                  <div className="flex items-center gap-2 text-lg">
                    <Calendar className="h-4 w-4" />
                    {formatDate(expense.date)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Catégorisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Groupe</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-sm">
                      {
                        EXPENSE_CATEGORY_GROUP_LABELS[
                          expense.group as keyof typeof EXPENSE_CATEGORY_GROUP_LABELS
                        ]
                      }
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Catégorie</label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-sm">
                      {
                        EXPENSE_CATEGORY_LABELS[
                          expense.category as keyof typeof EXPENSE_CATEGORY_LABELS
                        ]
                      }
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {expense.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{expense.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informations secondaires */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Employé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">{employeeName || 'Employé non trouvé'}</div>
              <div className="text-sm text-gray-500 mt-1">ID: {expense.employeeId}</div>
            </CardContent>
          </Card>

          {expense.projectId && (
            <Card>
              <CardHeader>
                <CardTitle>Projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">ID: {expense.projectId}</div>
              </CardContent>
            </Card>
          )}

          {expense.fileUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Pièce justificative</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p
                        className="font-medium"
                        onClick={handleViewDocument}
                        style={{ cursor: 'pointer' }}
                      >
                        {getFileName(expense.fileUrl)}
                      </p>
                      <p className="text-sm text-gray-500">Pièce justificative</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Créée le</label>
                <div className="text-sm">{formatDateTime(expense.createdAt)}</div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500">Modifiée le</label>
                <div className="text-sm">{formatDateTime(expense.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Visionneuse de documents */}
          <DocumentViewer
            isOpen={isViewerOpen}
            onClose={() => setIsViewerOpen(false)}
            expenseId={expense.id}
            fileName={expense.fileUrl ? getFileName(expense.fileUrl) : undefined}
            fileUrl={expense.fileUrl}
          />
        </div>
      </div>
    </div>
  );
}
