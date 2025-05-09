'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { useRequestDeleteAccount } from '@/lib/api/hooks/use-profile-mutations';
import { DeleteAccountRequestSchema, type DeleteAccountRequest } from '@/lib/validators/profile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

export function DeleteAccountForm() {
  const { mutate: requestDeleteAccount, isPending } = useRequestDeleteAccount();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const form = useForm<DeleteAccountRequest>({
    resolver: zodResolver(DeleteAccountRequestSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = (values: DeleteAccountRequest) => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const values = form.getValues();
    requestDeleteAccount(values, {
      onSuccess: () => {
        form.reset();
        setConfirmDialogOpen(false);
      },
    });
  };

  return (
    <>
      <Card className="border-red-200">
        <CardHeader className="text-red-600">
          <CardTitle>Supprimer mon compte</CardTitle>
          <CardDescription className="text-red-500">
            Demandez la suppression de votre compte. Cette action est irréversible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raison de la suppression</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Veuillez indiquer la raison pour laquelle vous souhaitez supprimer votre compte"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <LoadingButton
            onClick={form.handleSubmit(onSubmit)}
            isLoading={isPending}
            loadingText="Envoi en cours..."
            variant="destructive"
            className="ml-auto"
          >
            Demander la suppression
          </LoadingButton>
        </CardFooter>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Confirmer la demande de suppression</span>
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir demander la suppression de votre compte ? Cette action
              enverra une demande à l'administrateur.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-800">
            <p>
              Une fois votre demande approuvée, toutes vos données personnelles seront supprimées et
              vous ne pourrez plus accéder à votre compte.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Annuler
            </Button>
            <LoadingButton
              variant="destructive"
              onClick={handleConfirmDelete}
              isLoading={isPending}
              loadingText="Envoi en cours..."
            >
              Confirmer la demande
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
