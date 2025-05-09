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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  ClientFileInternationalRequestSchema,
  type ClientFileInternationalRequest,
} from '@/types/client-file';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import countries from '@/data/countries.json';
import currencies from '@/data/currencies.json';

interface InternationalFormProps {
  onSubmit: (data: ClientFileInternationalRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileInternationalRequest>;
}

export function InternationalForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: InternationalFormProps) {
  const form = useForm<ClientFileInternationalRequest>({
    resolver: zodResolver(ClientFileInternationalRequestSchema),
    defaultValues: {
      hasInternationalOps: defaultValues?.hasInternationalOps ?? false,
      transactionCountries: defaultValues?.transactionCountries || [],
      transactionCurrencies: defaultValues?.transactionCurrencies || [],
    },
  });

  const hasInternationalOps = form.watch('hasInternationalOps');

  const handleSubmit = async (data: ClientFileInternationalRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="hasInternationalOps"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Opérations internationales</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === 'true')}
                      value={field.value ? 'true' : 'false'}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">Non</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">Oui</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasInternationalOps && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="transactionCountries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays concernés</FormLabel>
                      <FormControl>
                        <MultiSelectCombobox
                          options={countries}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Sélectionner les pays concernés"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionCurrencies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devises utilisées</FormLabel>
                      <FormControl>
                        <MultiSelectCombobox
                          options={currencies}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Sélectionner les devises utilisées"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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
