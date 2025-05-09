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
import { ClientFileAddressRequestSchema, type ClientFileAddressRequest } from '@/types/client-file';

interface AddressFormProps {
  onSubmit: (data: ClientFileAddressRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileAddressRequest>;
}

export function AddressForm({ onSubmit, isSubmitting = false, defaultValues }: AddressFormProps) {
  const form = useForm<ClientFileAddressRequest>({
    resolver: zodResolver(ClientFileAddressRequestSchema),
    defaultValues: {
      homeAddress: defaultValues?.homeAddress || '',
      postalAddress: defaultValues?.postalAddress || '',
      taxResidenceCountry: defaultValues?.taxResidenceCountry || '',
      phoneNumbers: defaultValues?.phoneNumbers || '',
    },
  });

  const handleSubmit = async (data: ClientFileAddressRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="homeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse du domicile</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adresse complète" {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse postale (si différente)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adresse postale" {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taxResidenceCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays de résidence fiscale</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays de résidence fiscale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéros de téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numéros de téléphone (séparés par des virgules)"
                        {...field}
                      />
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
