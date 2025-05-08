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
  ClientFileSituationRequestSchema,
  type ClientFileSituationRequest,
} from '@/types/client-file';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SituationFormProps {
  onSubmit: (data: ClientFileSituationRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileSituationRequest>;
}

export function SituationForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: SituationFormProps) {
  const form = useForm<ClientFileSituationRequest>({
    resolver: zodResolver(ClientFileSituationRequestSchema),
    defaultValues: {
      incomeSources: defaultValues?.incomeSources || '',
      monthlyIncome: defaultValues?.monthlyIncome || undefined,
      incomeCurrency: defaultValues?.incomeCurrency || 'EUR',
      fundsOriginDestination: defaultValues?.fundsOriginDestination || '',
      assets: defaultValues?.assets || '',
    },
  });

  const handleSubmit = async (data: ClientFileSituationRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="incomeSources"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sources de revenus</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une source de revenus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Salaire">Salaire</SelectItem>
                        <SelectItem value="Pension">Pension</SelectItem>
                        <SelectItem value="Retraite">Retraite</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenu mensuel</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Revenu mensuel"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="incomeCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">Dollar US (USD)</SelectItem>
                        <SelectItem value="GBP">Livre Sterling (GBP)</SelectItem>
                        <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                        <SelectItem value="CAD">Dollar Canadien (CAD)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fundsOriginDestination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origine et destination des fonds</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Origine et destination des fonds"
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patrimoine</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description du patrimoine"
                      {...field}
                      className="min-h-[100px]"
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
