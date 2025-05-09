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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LoadingButton } from '@/components/ui/loading-button';
import {
  ClientFileComplianceRequestSchema,
  type ClientFileComplianceRequest,
} from '@/types/client-file';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ComplianceFormProps {
  onSubmit: (data: ClientFileComplianceRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileComplianceRequest>;
}

export function ComplianceForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: ComplianceFormProps) {
  const form = useForm<ClientFileComplianceRequest>({
    resolver: zodResolver(ClientFileComplianceRequestSchema),
    defaultValues: {
      riskLevel: defaultValues?.riskLevel || '',
      classificationSource: defaultValues?.classificationSource || '',
      degradationReason: defaultValues?.degradationReason || '',
      fatcaStatus: defaultValues?.fatcaStatus || '',
      hasUsIndications: defaultValues?.hasUsIndications ?? false,
      usIndicationsDetails: defaultValues?.usIndicationsDetails || '',
    },
  });

  const hasUsIndications = form.watch('hasUsIndications');
  const riskLevel = form.watch('riskLevel');

  const handleSubmit = async (data: ClientFileComplianceRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau de risque LBC/FT</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau de risque" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Faible">Faible</SelectItem>
                      <SelectItem value="Moyen">Moyen</SelectItem>
                      <SelectItem value="Élevé">Élevé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classificationSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source de la classification</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Source de la classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Score">Score</SelectItem>
                      <SelectItem value="Dégradation">Dégradation de scoring</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {riskLevel === 'Élevé' && (
              <FormField
                control={form.control}
                name="degradationReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raison de la dégradation du niveau de risque</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Raison de la dégradation"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="fatcaStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut FATCA</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut FATCA" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Non concerné">Non concerné</SelectItem>
                      <SelectItem value="US Person">US Person</SelectItem>
                      <SelectItem value="Non-US Person">Non-US Person</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasUsIndications"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Présence d'indices US</FormLabel>
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

            {hasUsIndications && (
              <FormField
                control={form.control}
                name="usIndicationsDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Détails des indices US</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Détails des indices US"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
