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
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  ClientFileServicesRequestSchema,
  type ClientFileServicesRequest,
} from '@/types/client-file';

interface ServicesFormProps {
  onSubmit: (data: ClientFileServicesRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileServicesRequest>;
}

export function ServicesForm({ onSubmit, isSubmitting = false, defaultValues }: ServicesFormProps) {
  const form = useForm<ClientFileServicesRequest>({
    resolver: zodResolver(ClientFileServicesRequestSchema),
    defaultValues: {
      offeredAccounts: defaultValues?.offeredAccounts || '',
    },
  });

  const handleSubmit = async (data: ClientFileServicesRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="offeredAccounts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comptes et services proposés</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Détaillez les comptes et services proposés au client"
                      {...field}
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
