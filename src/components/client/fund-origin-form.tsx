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
  ClientFileFundOriginRequestSchema,
  type ClientFileFundOriginRequest,
} from '@/types/client-file';
import { Checkbox } from '@/components/ui/checkbox';

// Définir le type des sources de fonds pour éviter les erreurs de typage
type FundSourceType =
  | 'épargne personnel'
  | 'revenue familial'
  | 'bourse'
  | 'prêt étudiant'
  | 'Don financier'
  | 'Autre';

// Liste des sources de fonds valides
const VALID_FUND_SOURCES: FundSourceType[] = [
  'épargne personnel',
  'revenue familial',
  'bourse',
  'prêt étudiant',
  'Don financier',
  'Autre',
];

interface FundOriginFormProps {
  onSubmit: (data: ClientFileFundOriginRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileFundOriginRequest>;
}

export function FundOriginForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: FundOriginFormProps) {
  // Filtrer les sources de fonds pour ne garder que les valeurs valides
  const validFundSources =
    defaultValues?.fundSources?.filter((source): source is FundSourceType =>
      VALID_FUND_SOURCES.includes(source as FundSourceType)
    ) || [];

  const form = useForm<ClientFileFundOriginRequest>({
    resolver: zodResolver(ClientFileFundOriginRequestSchema),
    defaultValues: {
      fundSources: validFundSources,
      fundProviderName: defaultValues?.fundProviderName || '',
      fundProviderRelation: defaultValues?.fundProviderRelation || '',
      fundDonationExplanation: defaultValues?.fundDonationExplanation || '',
    },
  });

  const fundSources = form.watch('fundSources') || [];
  const hasDonation = fundSources.includes('Don financier');

  const handleSubmit = async (data: ClientFileFundOriginRequest) => {
    await onSubmit(data);
  };

  // Définir les options avec le type correct
  const fundSourceOptions: { id: FundSourceType; label: string }[] = [
    { id: 'épargne personnel', label: 'Épargne personnelle' },
    { id: 'revenue familial', label: 'Revenu familial' },
    { id: 'bourse', label: 'Bourse' },
    { id: 'prêt étudiant', label: 'Prêt étudiant' },
    { id: 'Don financier', label: 'Don financier' },
    { id: 'Autre', label: 'Autre' },
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fundSources"
              render={() => (
                <FormItem>
                  <FormLabel>Sources des fonds</FormLabel>
                  <div className="space-y-2">
                    {fundSourceOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="fundSources"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      // Ajouter la valeur typée au tableau
                                      field.onChange([...currentValue, option.id]);
                                    } else {
                                      // Filtrer la valeur du tableau
                                      field.onChange(
                                        currentValue.filter((value) => value !== option.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasDonation && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fundProviderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du donateur</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du donateur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fundProviderRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation avec le donateur</FormLabel>
                      <FormControl>
                        <Input placeholder="Relation avec le donateur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fundDonationExplanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explication du don</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Expliquez la provenance et la raison du don"
                          {...field}
                          className="min-h-[100px]"
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
