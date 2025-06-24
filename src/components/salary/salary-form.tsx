'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '@/lib/api/hooks/use-users';
import { useMonthlyApprovedAdvance } from '@/lib/api/hooks/use-salary-advances';
import { formatCurrency } from '@/lib/utils/currency';
import { PAYMENT_MODE_LABELS } from '@/lib/constants/salary-constants';
import type { SalaryDTO, CreateSalaryRequest, UpdateSalaryRequest } from '@/types/salary';

const salaryFormSchema = z.object({
  employeeId: z.string().min(1, 'Veuillez sélectionner un employé'),
  grossSalary: z.coerce.number().min(0, 'Le salaire brut doit être positif'),
  deductions: z.coerce.number().min(0, 'Les déductions doivent être positives').default(0),
  paymentMode: z.string().min(1, 'Veuillez sélectionner un mode de paiement'),
  paymentDate: z.string().min(1, 'Veuillez sélectionner une date de paiement'),
});

type SalaryFormData = z.infer<typeof salaryFormSchema>;

interface SalaryFormProps {
  salary?: SalaryDTO;
  onSubmit: (data: CreateSalaryRequest | UpdateSalaryRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SalaryForm({ salary, onSubmit, onCancel, isLoading }: SalaryFormProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<string>('');

  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });
  const { data: advanceData } = useMonthlyApprovedAdvance(
    selectedEmployeeId,
    currentYear,
    currentMonth
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SalaryFormData>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      employeeId: salary?.employeeId || '',
      grossSalary: salary?.grossSalary || 0,
      deductions: salary?.deductions || 0,
      paymentMode: salary?.paymentMode || '',
      paymentDate: salary?.paymentDate
        ? new Date(salary.paymentDate).toISOString().split('T')[0]
        : '',
    },
  });

  const watchedValues = watch();
  const advances = advanceData?.total || 0;
  const netSalary = watchedValues.grossSalary - watchedValues.deductions - advances;

  useEffect(() => {
    if (salary) {
      setValue('employeeId', salary.employeeId);
      setValue('grossSalary', salary.grossSalary);
      setValue('deductions', salary.deductions);
      setValue('paymentMode', salary.paymentMode);
      setValue('paymentDate', new Date(salary.paymentDate).toISOString().split('T')[0]);
      setSelectedEmployeeId(salary.employeeId);
    }
  }, [salary, setValue]);

  useEffect(() => {
    const now = new Date();
    setCurrentMonth((now.getMonth() + 1).toString().padStart(2, '0'));
    setCurrentYear(now.getFullYear().toString());
  }, []);

  const handleFormSubmit = (data: SalaryFormData) => {
    const formData = {
      ...data,
      paymentDate: new Date(data.paymentDate),
      advances,
    };

    onSubmit(formData as CreateSalaryRequest | UpdateSalaryRequest);
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setValue('employeeId', employeeId);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sélection de l'employé */}
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employé *</Label>
          <Select onValueChange={handleEmployeeChange} defaultValue={watchedValues.employeeId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              {usersData?.items?.map((user: any) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employeeId && <p className="text-sm text-red-600">{errors.employeeId.message}</p>}
        </div>

        {/* Salaire brut */}
        <div className="space-y-2">
          <Label htmlFor="grossSalary">Salaire brut (FCFA) *</Label>
          <Input
            id="grossSalary"
            type="number"
            step="0.01"
            {...register('grossSalary')}
            placeholder="0"
          />
          {errors.grossSalary && (
            <p className="text-sm text-red-600">{errors.grossSalary.message}</p>
          )}
        </div>

        {/* Déductions */}
        <div className="space-y-2">
          <Label htmlFor="deductions">Déductions (FCFA)</Label>
          <Input
            id="deductions"
            type="number"
            step="0.01"
            {...register('deductions')}
            placeholder="0"
          />
          {errors.deductions && <p className="text-sm text-red-600">{errors.deductions.message}</p>}
        </div>

        {/* Mode de paiement */}
        <div className="space-y-2">
          <Label htmlFor="paymentMode">Mode de paiement *</Label>
          <Select
            onValueChange={(value) => setValue('paymentMode', value)}
            defaultValue={watchedValues.paymentMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PAYMENT_MODE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paymentMode && (
            <p className="text-sm text-red-600">{errors.paymentMode.message}</p>
          )}
        </div>

        {/* Date de paiement */}
        <div className="space-y-2">
          <Label htmlFor="paymentDate">Date de paiement *</Label>
          <Input id="paymentDate" type="date" {...register('paymentDate')} />
          {errors.paymentDate && (
            <p className="text-sm text-red-600">{errors.paymentDate.message}</p>
          )}
        </div>
      </div>

      {/* Résumé des calculs */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des calculs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Salaire brut:</span>
            <span className="font-medium">{formatCurrency(watchedValues.grossSalary || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Déductions:</span>
            <span className="font-medium text-red-600">
              -{formatCurrency(watchedValues.deductions || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Avances du mois:</span>
            <span className="font-medium text-red-600">-{formatCurrency(advances)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Salaire net:</span>
            <span className={netSalary >= 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(netSalary)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : salary ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
