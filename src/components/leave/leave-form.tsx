'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useUsers } from '@/lib/api/hooks/use-users';
import { type LeaveDTO, type CreateLeaveRequest, LeaveType, UpdateLeaveRequest } from '@/types/leave';
import { LEAVE_TYPE_OPTIONS } from '@/lib/constants/leave-constants';

const leaveFormSchema = z
  .object({
    employeeId: z.string().min(1, "L'employé est requis"),
    leaveType: z.nativeEnum(LeaveType, { required_error: 'Le type de congé est requis' }),
    startDate: z.string({ required_error: 'La date de début est requise' }),
    endDate: z.string({ required_error: 'La date de fin est requise' }),
    comment: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'La date de fin doit être postérieure ou égale à la date de début',
    path: ['endDate'],
  });

type LeaveFormData = z.infer<typeof leaveFormSchema>;

interface LeaveFormProps {
  leave?: LeaveDTO | null;
  onSubmit?: (data: CreateLeaveRequest) => void;
  onUpdate?: (data: UpdateLeaveRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LeaveForm({ leave, onSubmit, onUpdate, onCancel, isLoading }: LeaveFormProps) {
  const { profile } = useProfile();

  // Vérifier si l'utilisateur peut sélectionner d'autres employés
  const canSelectEmployee = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

  const { data: usersData } = useUsers({ page: 1, pageSize: 100 }, { enabled: canSelectEmployee });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      employeeId: leave?.employeeId || profile?.id || '',
      leaveType: leave?.leaveType || LeaveType.ANNUAL,
      startDate: leave?.startDate
        ? new Date(leave.startDate).toISOString().split('T')[0]
        : undefined,
      endDate: leave?.endDate ? new Date(leave.endDate).toISOString().split('T')[0] : undefined,
      comment: leave?.comment || '',
    },
  });

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  const calculateDays = () => {
    const start = new Date(watchedStartDate.toString());
    const end = new Date(watchedEndDate.toString());

    if (start && end) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const handleFormSubmit = (data: LeaveFormData) => {
    if (leave && onUpdate) {
      onUpdate({
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });
    } else if (onSubmit) {
      onSubmit({
        ...data,
        userId: profile?.id || '',
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });
    }
  };

  const getEmployeeName = (employeeId: string) => {
    if (canSelectEmployee && usersData?.items) {
      const user = usersData.items.find((u) => u.id === employeeId);
      return user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user?.username
        : employeeId.slice(0, 8);
    }
    return profile?.id === employeeId
      ? `${profile?.firstname || ''} ${profile?.lastname || ''}`.trim() || profile?.username
      : employeeId.slice(0, 8);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {leave ? 'Modifier la demande de congé' : 'Nouvelle demande de congé'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Sélection de l'employé */}
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employé</Label>
            {canSelectEmployee ? (
              <Select
                value={watch('employeeId')}
                onValueChange={(value) => setValue('employeeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {usersData?.items?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value={getEmployeeName(watch('employeeId'))} disabled className="bg-gray-50" />
            )}
            {errors.employeeId && (
              <p className="text-sm text-red-600">{errors.employeeId.message}</p>
            )}
          </div>

          {/* Type de congé */}
          <div className="space-y-2">
            <Label htmlFor="leaveType">Type de congé</Label>
            <Select
              value={watch('leaveType')}
              onValueChange={(value) => setValue('leaveType', value as LeaveType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leaveType && <p className="text-sm text-red-600">{errors.leaveType.message}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date de début */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
              {errors.endDate && <p className="text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Durée calculée */}
          {watchedStartDate && watchedEndDate && (
            <Alert>
              <AlertDescription>
                Durée du congé : <strong>{calculateDays()} jour(s)</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Commentaire */}
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              {...register('comment')}
              placeholder="Motif ou commentaire sur la demande..."
              rows={3}
            />
            {errors.comment && <p className="text-sm text-red-600">{errors.comment.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : leave ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
