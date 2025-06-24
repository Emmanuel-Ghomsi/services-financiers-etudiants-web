'use client';

import { Download, Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/currency';
import { PAYMENT_MODE_LABELS } from '@/lib/constants/salary-constants';
import { useSalaryPdfDownload } from '@/lib/api/hooks/use-salaries';
import type { SalaryDTO } from '@/types/salary';
import { useRouter } from 'next/navigation';

interface SalaryViewProps {
  salary: SalaryDTO;
  onEdit?: () => void;
  employeeName?: string;
}

export function SalaryView({ salary, onEdit, employeeName }: SalaryViewProps) {
  const router = useRouter();
  const { downloadPdf, isDownloading } = useSalaryPdfDownload();

  const handleDownload = () => {
    downloadPdf(salary.id);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Fiche de salaire</h1>
            <p className="text-gray-600">
              Période: {salary.month}/{salary.year}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {/*<Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Téléchargement...' : 'Télécharger PDF'}
          </Button>*/}
          {onEdit && (
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Employé</label>
              <p className="text-lg">{employeeName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Période</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {salary.month}/{salary.year}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Mode de paiement</label>
              <div className="mt-1">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {PAYMENT_MODE_LABELS[salary.paymentMode as keyof typeof PAYMENT_MODE_LABELS]}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date de paiement</label>
              <p className="text-lg">
                {new Date(salary.paymentDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Détail des calculs */}
        <Card>
          <CardHeader>
            <CardTitle>Détail des calculs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Salaire brut</span>
              <span className="text-lg font-medium">{formatCurrency(salary.grossSalary)}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Déductions</span>
              <span className="text-lg font-medium text-red-600">
                -{formatCurrency(salary.deductions)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avances du mois</span>
              <span className="text-lg font-medium text-red-600">
                -{formatCurrency(salary.advances)}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Salaire net</span>
              <span
                className={`text-xl font-bold ${
                  salary.netSalary >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(salary.netSalary)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations de traçabilité */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de traçabilité</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Date de création</label>
            <p className="text-sm">{new Date(salary.createdAt).toLocaleString('fr-FR')}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Dernière modification</label>
            <p className="text-sm">{new Date(salary.updatedAt).toLocaleString('fr-FR')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
