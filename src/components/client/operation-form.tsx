'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  ClientFileOperationRequestSchema,
  type ClientFileOperationRequest,
} from '@/types/client-file';

interface OperationFormProps {
  onSubmit: (data: ClientFileOperationRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileOperationRequest>;
}

export function OperationForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: OperationFormProps) {
  const form = useForm<ClientFileOperationRequest>({
    resolver: zodResolver(ClientFileOperationRequestSchema),
    defaultValues: {
      expectedOperations: defaultValues?.expectedOperations || '',
      creditAmount: defaultValues?.creditAmount || '',
      debitAmount: defaultValues?.debitAmount || '',
    },
  });

  const handleSubmit = async (data: ClientFileOperationRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="expectedOperations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opérations attendues</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Détaillez les opérations attendues sur le compte"
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="creditAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant des crédits</FormLabel>
                    <FormControl>
                      <Input placeholder="Montant des crédits" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="debitAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant des débits</FormLabel>
                    <FormControl>
                      <Input placeholder="Montant des débits" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <LoadingButton
                type="submit"
                isLoading={isSubmitting}
                loadingText="Enregistrement..."
                className="bg-brand-blue hover:bg-brand-blue-light"
              >
                Suivant
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
