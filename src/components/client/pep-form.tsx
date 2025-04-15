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
import { ClientFilePepRequestSchema, type ClientFilePepRequest } from '@/types/client-file';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PepFormProps {
  onSubmit: (data: ClientFilePepRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFilePepRequest>;
}

export function PepForm({ onSubmit, isSubmitting = false, defaultValues }: PepFormProps) {
  const form = useForm<ClientFilePepRequest>({
    resolver: zodResolver(ClientFilePepRequestSchema),
    defaultValues: {
      isPEP: defaultValues?.isPEP ?? false,
      pepType: defaultValues?.pepType || '',
      pepMandate: defaultValues?.pepMandate || '',
      pepEndDate: defaultValues?.pepEndDate || undefined,
      pepLinkType: defaultValues?.pepLinkType || '',
      pepLastName: defaultValues?.pepLastName || '',
      pepFirstName: defaultValues?.pepFirstName || '',
      pepBirthDate: defaultValues?.pepBirthDate || undefined,
      pepBirthPlace: defaultValues?.pepBirthPlace || '',
    },
  });

  const isPEP = form.watch('isPEP');

  const handleSubmit = async (data: ClientFilePepRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="isPEP"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Le client est-il une Personne Politiquement Exposée (PPE) ?</FormLabel>
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

            {isPEP && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="pepType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de PPE</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PPE directe">PPE directe</SelectItem>
                          <SelectItem value="PPE indirecte">PPE indirecte</SelectItem>
                          <SelectItem value="Proche de PPE">Proche de PPE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pepMandate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mandat politique</FormLabel>
                      <FormControl>
                        <Input placeholder="Mandat politique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pepEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de fin de mandat</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pepLinkType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de lien avec la PPE</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un type de lien" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lui-même">Lui-même</SelectItem>
                          <SelectItem value="Conjoint">Conjoint</SelectItem>
                          <SelectItem value="Enfant">Enfant</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Associé">Associé</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pepLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la PPE</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pepFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom de la PPE</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pepBirthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de naissance de la PPE</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pepBirthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu de naissance de la PPE</FormLabel>
                      <FormControl>
                        <Input placeholder="Lieu de naissance" {...field} />
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
