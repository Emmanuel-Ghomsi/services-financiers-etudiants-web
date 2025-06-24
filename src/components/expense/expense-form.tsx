'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import {
  ExpenseCategory,
  ExpenseCategoryGroup,
  type CreateExpenseRequest,
  type UpdateExpenseRequest,
  type ExpenseDTO,
} from '@/types/expense';
import {
  EXPENSE_CATEGORY_GROUP_LABELS,
  EXPENSE_CATEGORY_LABELS,
  CATEGORIES_BY_GROUP,
} from '@/lib/constants/expense-categories';
import { useUsers } from '@/lib/api/hooks/use-users';
import { useSession } from 'next-auth/react';

const expenseFormSchema = z.object({
  amount: z.coerce.number().positive('Le montant doit être positif'),
  date: z.string().min(1, 'La date est requise'),
  group: z.nativeEnum(ExpenseCategoryGroup, { required_error: 'Le groupe est requis' }),
  category: z.nativeEnum(ExpenseCategory, { required_error: 'La catégorie est requise' }),
  description: z.string().optional(),
  employeeId: z.string().min(1, "L'employé est requis"),
  projectId: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  expense?: ExpenseDTO;
  onSubmit: (data: CreateExpenseRequest | UpdateExpenseRequest, file?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ExpenseForm({ expense, onSubmit, onCancel, isLoading }: ExpenseFormProps) {
  const { data: session } = useSession();
  const [selectedGroup, setSelectedGroup] = useState<ExpenseCategoryGroup | ''>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [hasExistingFile, setHasExistingFile] = useState<boolean>(!!expense?.fileUrl);

  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: expense?.amount || 0,
      date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : '',
      group: (expense?.group as ExpenseCategoryGroup) || '',
      category: (expense?.category as ExpenseCategory) || '',
      description: expense?.description || '',
      employeeId: expense?.employeeId || session?.user?.id || '',
      projectId: expense?.projectId || '',
    },
  });

  const watchedGroup = form.watch('group');

  useEffect(() => {
    if (watchedGroup && watchedGroup !== selectedGroup) {
      setSelectedGroup(watchedGroup);
      // Ne pas réinitialiser la catégorie si on est en mode édition et que la catégorie actuelle appartient au groupe sélectionné
      if (!expense || !CATEGORIES_BY_GROUP[watchedGroup].includes(form.watch('category'))) {
        form.setValue('category', '' as any);
      }
    }
  }, [watchedGroup, selectedGroup, form, expense]);

  useEffect(() => {
    if (expense) {
      setSelectedGroup(expense.group as ExpenseCategoryGroup);
      setHasExistingFile(!!expense.fileUrl);
    }
  }, [expense]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    // Si on modifie une dépense existante, on marque qu'on veut supprimer le fichier existant
    if (expense?.fileUrl) {
      setHasExistingFile(false);
    }
    // Reset de l'input file
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (data: ExpenseFormData) => {
    // Créer l'objet avec le bon type qui inclut fileUrl
    const submitData: CreateExpenseRequest | UpdateExpenseRequest = {
      ...data,
      date: new Date(data.date),
      projectId: data.projectId || undefined,
    };

    // Si on a supprimé le fichier existant, on doit le signaler
    if (expense?.fileUrl && !hasExistingFile && !uploadedFile) {
      submitData.fileUrl = undefined; // Signaler la suppression
    }

    onSubmit(submitData, uploadedFile || undefined);
  };

  const availableCategories = selectedGroup ? CATEGORIES_BY_GROUP[selectedGroup] : [];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{expense ? 'Modifier la dépense' : 'Ajouter une dépense'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA) *</Label>
              <Input
                id="amount"
                type="number"
                step="1"
                placeholder="0"
                {...form.register('amount')}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" {...form.register('date')} />
              {form.formState.errors.date && (
                <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Groupe de catégorie *</Label>
            <Select
              value={form.watch('group')}
              onValueChange={(value) => form.setValue('group', value as ExpenseCategoryGroup)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un groupe" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXPENSE_CATEGORY_GROUP_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.group && (
              <p className="text-sm text-red-500">{form.formState.errors.group.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select
              value={form.watch('category')}
              onValueChange={(value) => form.setValue('category', value as ExpenseCategory)}
              disabled={!selectedGroup}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {EXPENSE_CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employé *</Label>
            <Select
              value={form.watch('employeeId')}
              onValueChange={(value) => form.setValue('employeeId', value)}
            >
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
            {form.formState.errors.employeeId && (
              <p className="text-sm text-red-500">{form.formState.errors.employeeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description de la dépense..."
              {...form.register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Pièce justificative</Label>

            {/* Fichier existant */}
            {hasExistingFile && expense?.fileUrl && !uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Fichier existant</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Nouveau fichier uploadé */}
            {uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">{uploadedFile.name}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Zone d'upload */}
            {!uploadedFile && (!hasExistingFile || !expense?.fileUrl) && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Cliquez pour uploader une facture ou un reçu
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : expense ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
