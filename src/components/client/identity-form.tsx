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
  ClientFileIdentityRequestSchema,
  type ClientFileIdentityRequest,
} from '@/types/client-file';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface IdentityFormProps {
  onSubmit: (data: ClientFileIdentityRequest) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ClientFileIdentityRequest>;
}

export function IdentityForm({ onSubmit, isSubmitting = false, defaultValues }: IdentityFormProps) {
  const form = useForm<ClientFileIdentityRequest>({
    resolver: zodResolver(ClientFileIdentityRequestSchema),
    defaultValues: {
      lastName: defaultValues?.lastName || '',
      firstName: defaultValues?.firstName || '',
      email: defaultValues?.email || '',
      maidenName: defaultValues?.maidenName || '',
      birthDate: defaultValues?.birthDate || undefined,
      birthCity: defaultValues?.birthCity || '',
      birthCountry: defaultValues?.birthCountry || '',
      identityType: defaultValues?.identityType || '',
      identityNumber: defaultValues?.identityNumber || '',
      nationality: defaultValues?.nationality || '',
      legalRepresentative: defaultValues?.legalRepresentative || '',
      hasBankAccount: defaultValues?.hasBankAccount ?? false,
      taxIdNumber: defaultValues?.taxIdNumber || '',
      taxCountry: defaultValues?.taxCountry || '',
    },
  });

  const handleSubmit = async (data: ClientFileIdentityRequest) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maidenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de jeune fille</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de jeune fille" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de naissance</FormLabel>
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
                name="birthCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville de naissance</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville de naissance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays de naissance</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays de naissance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationalité</FormLabel>
                    <FormControl>
                      <Input placeholder="Nationalité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de pièce d'identité</FormLabel>
                    <FormControl>
                      <Input placeholder="Type de pièce d'identité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de pièce d'identité</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de pièce d'identité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legalRepresentative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Représentant légal</FormLabel>
                    <FormControl>
                      <Input placeholder="Représentant légal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro d'identification fiscale</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro d'identification fiscale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays d'imposition</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays d'imposition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasBankAccount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Possède déjà un compte bancaire</FormLabel>
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
