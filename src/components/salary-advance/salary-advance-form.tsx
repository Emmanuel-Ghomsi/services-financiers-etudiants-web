'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUsers } from '@/lib/api/hooks/use-users';
import { useProfile } from '@/lib/api/hooks/use-profile';
import type {
  CreateSalaryAdvanceRequest,
  UpdateSalaryAdvanceRequest,
  SalaryAdvanceDTO,
} from '@/types/salary-advance';

const salaryAdvanceFormSchema = z.object({
  employeeId: z.string().min(1, 'Veuillez sélectionner un employé'),
  amount: z.coerce.number().min(1, 'Le montant doit être supérieur à 0'),
  reason: z.string().min(3, 'Le motif doit contenir au moins 3 caractères'),
  requestedDate: z.string().min(1, 'Veuillez sélectionner une date'),
});

type SalaryAdvanceFormData = z.infer<typeof salaryAdvanceFormSchema>;

interface SalaryAdvanceFormProps {
  advance?: SalaryAdvanceDTO | null;
  onSubmit?: (data: CreateSalaryAdvanceRequest) => void;
  onUpdate?: (data: UpdateSalaryAdvanceRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SalaryAdvanceForm({
  advance,
  onSubmit,
  onUpdate,
  onCancel,
  isLoading,
}: SalaryAdvanceFormProps) {
  const { profile } = useProfile();

  // Vérifier si l'utilisateur peut sélectionner un employé (RH/Admin) - calculé avant les hooks
  const canSelectEmployee = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

  const { data: usersData } = useUsers({ page: 1, pageSize: 100 }, { enabled: canSelectEmployee });

  const isEditing = !!advance;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SalaryAdvanceFormData>({
    resolver: zodResolver(salaryAdvanceFormSchema),
    defaultValues: {
      employeeId: advance?.employeeId || profile?.id || '',
      amount: advance?.amount || 0,
      reason: advance?.reason || '',
      requestedDate: advance?.requestedDate
        ? new Date(advance.requestedDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  // Réinitialiser le formulaire quand l'avance change
  useEffect(() => {
    if (advance) {
      reset({
        employeeId: advance.employeeId,
        amount: advance.amount,
        reason: advance.reason,
        requestedDate: new Date(advance.requestedDate).toISOString().split('T')[0],
      });
    } else {
      reset({
        employeeId: profile?.id || '',
        amount: 0,
        reason: '',
        requestedDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [advance, profile?.id, reset]);

  const watchedValues = watch();

  const handleFormSubmit = (data: SalaryAdvanceFormData) => {
    if (isEditing && onUpdate) {
      // Pour la modification, on envoie les données avec requestedDate en string
      const updateData: UpdateSalaryAdvanceRequest = {
        employeeId: data.employeeId,
        amount: data.amount,
        reason: data.reason,
        requestedDate: data.requestedDate, // Déjà en format string
      };
      onUpdate(updateData);
    } else if (onSubmit) {
      // Pour la création, on convertit requestedDate en Date
      const createData: CreateSalaryAdvanceRequest = {
        employeeId: data.employeeId,
        amount: data.amount,
        reason: data.reason,
        requestedDate: new Date(data.requestedDate),
        userId: profile?.id,
      };
      onSubmit(createData);
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    setValue('employeeId', employeeId);
  };

  // Trouver le nom de l'employé sélectionné
  const selectedEmployee = canSelectEmployee
    ? usersData?.items?.find((user: any) => user.id === watchedValues.employeeId)
    : null;

  const employeeName =
    canSelectEmployee && selectedEmployee
      ? `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`.trim() ||
        selectedEmployee.username
      : `${profile?.firstname || ''} ${profile?.lastname || ''}`.trim() || profile?.username;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sélection de l'employé */}
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employé *</Label>
          {canSelectEmployee ? (
            <Select onValueChange={handleEmployeeChange} value={watchedValues.employeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {usersData?.items?.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstname && user.lastname
                      ? `${user.firstname} ${user.lastname}`
                      : user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={employeeName || 'Employé non trouvé'} disabled className="bg-gray-50" />
          )}
          {errors.employeeId && <p className="text-sm text-red-600">{errors.employeeId.message}</p>}
        </div>

        {/* Montant */}
        <div className="space-y-2">
          <Label htmlFor="amount">Montant (FCFA) *</Label>
          <Input id="amount" type="number" step="0.01" {...register('amount')} placeholder="0" />
          {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        {/* Date souhaitée */}
        <div className="space-y-2">
          <Label htmlFor="requestedDate">Date souhaitée *</Label>
          <Input id="requestedDate" type="date" {...register('requestedDate')} />
          {errors.requestedDate && (
            <p className="text-sm text-red-600">{errors.requestedDate.message}</p>
          )}
        </div>
      </div>

      {/* Motif */}
      <div className="space-y-2">
        <Label htmlFor="reason">Motif de la demande *</Label>
        <Textarea
          id="reason"
          {...register('reason')}
          placeholder="Expliquez la raison de votre demande d'avance..."
          rows={4}
        />
        {errors.reason && <p className="text-sm text-red-600">{errors.reason.message}</p>}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditing
              ? 'Modification...'
              : 'Envoi...'
            : isEditing
            ? "Modifier l'avance"
            : "Demander l'avance"}
        </Button>
      </div>
    </form>
  );
}
