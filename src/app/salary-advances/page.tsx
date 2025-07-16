'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { SalaryAdvanceForm } from '@/components/salary-advance/salary-advance-form';
import { SalaryAdvancesTable } from '@/components/salary-advance/salary-advances-table';
import {
  useAllSalaryAdvances,
  useSalaryAdvanceHistory,
  useSalaryAdvanceMutations,
} from '@/lib/api/hooks/use-salary-advances';
import { useProfile } from '@/lib/api/hooks/use-profile';
import type {
  CreateSalaryAdvanceRequest,
  UpdateSalaryAdvanceRequest,
  SalaryAdvanceDTO,
  ValidationStatus,
} from '@/types/salary-advance';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';

export default function SalaryAdvancesPage() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState<SalaryAdvanceDTO | null>(null);
  const [advanceToDelete, setAdvanceToDelete] = useState<string | null>(null);

  const { profile } = useProfile();
  const { toast } = useToast();

  // Vérifier si l'utilisateur peut voir toutes les avances
  const canViewAll = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

  // Hooks pour les données - conditionnels selon les permissions
  const { data: allAdvances, isLoading: allAdvancesLoading } = useAllSalaryAdvances({
    enabled: canViewAll,
  });

  const { data: myAdvances, isLoading: myAdvancesLoading } = useSalaryAdvanceHistory(
    profile?.id || '',
    {
      enabled: !!profile?.id,
    }
  );

  const { requestAdvance, updateStatus, updateAdvance, deleteAdvance } =
    useSalaryAdvanceMutations();

  const handleCreateAdvance = (data: CreateSalaryAdvanceRequest) => {
    requestAdvance.mutate(data, {
      onSuccess: () => {
        setIsCreateFormOpen(false);
        toast({
          title: 'Succès',
          description: "Demande d'avance créée avec succès",
        });
      },
      onError: (error) => {
        toast({
          title: 'Erreur',
          description: "Erreur lors de la création de la demande d'avance",
          variant: 'destructive',
        });
      },
    });
  };

  const handleUpdateStatus = (id: string, status: ValidationStatus) => {
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({
            title: 'Succès',
            description: `Statut mis à jour avec succès`,
          });
        },
        onError: (error) => {
          toast({
            title: 'Erreur',
            description: 'Erreur lors de la mise à jour du statut',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleEditAdvance = (advance: SalaryAdvanceDTO) => {
    setSelectedAdvance(advance);
    setIsEditFormOpen(true);
  };

  const handleUpdateAdvance = (data: UpdateSalaryAdvanceRequest) => {
    if (!selectedAdvance) return;

    updateAdvance.mutate(
      { id: selectedAdvance.id, data },
      {
        onSuccess: () => {
          setIsEditFormOpen(false);
          setSelectedAdvance(null);
          toast({
            title: 'Succès',
            description: 'Avance modifiée avec succès',
          });
        },
        onError: (error) => {
          toast({
            title: 'Erreur',
            description: "Erreur lors de la modification de l'avance",
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDeleteAdvance = (id: string) => {
    setAdvanceToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAdvance = () => {
    if (!advanceToDelete) return;

    deleteAdvance.mutate(advanceToDelete, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setAdvanceToDelete(null);
        toast({
          title: 'Succès',
          description: 'Avance supprimée avec succès',
        });
      },
      onError: (error) => {
        toast({
          title: 'Erreur',
          description: "Erreur lors de la suppression de l'avance",
          variant: 'destructive',
        });
      },
    });
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setSelectedAdvance(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAdvanceToDelete(null);
  };

  return (
    <AuthenticatedLayout title="Avances sur salaire">
      <Breadcrumb segments={[{ name: 'Avances sur salaire', href: '/salary-advances' }]} />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Avances sur salaire</h1>
          <Button onClick={() => setIsCreateFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Demander une avance
          </Button>
        </div>

        <Tabs defaultValue={canViewAll ? 'all' : 'my'} className="space-y-4">
          <TabsList>
            {canViewAll && <TabsTrigger value="all">Toutes les demandes</TabsTrigger>}
            <TabsTrigger value="my">Mes demandes</TabsTrigger>
          </TabsList>

          {canViewAll && (
            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Toutes les demandes d'avance</CardTitle>
                </CardHeader>
                <CardContent>
                  <SalaryAdvancesTable
                    advances={allAdvances || []}
                    onEdit={handleEditAdvance}
                    onDelete={handleDeleteAdvance}
                    isLoading={allAdvancesLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="my" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes demandes d'avance</CardTitle>
              </CardHeader>
              <CardContent>
                <SalaryAdvancesTable
                  advances={myAdvances || []}
                  onEdit={handleEditAdvance}
                  onDelete={handleDeleteAdvance}
                  isLoading={myAdvancesLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de création */}
        <Dialog open={isCreateFormOpen} onOpenChange={handleCloseCreateForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Demander une avance sur salaire</DialogTitle>
            </DialogHeader>
            <SalaryAdvanceForm
              onSubmit={handleCreateAdvance}
              onCancel={handleCloseCreateForm}
              isLoading={requestAdvance.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog de modification */}
        <Dialog open={isEditFormOpen} onOpenChange={handleCloseEditForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la demande d'avance</DialogTitle>
            </DialogHeader>
            <SalaryAdvanceForm
              advance={selectedAdvance}
              onUpdate={handleUpdateAdvance}
              onCancel={handleCloseEditForm}
              isLoading={updateAdvance.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette demande d'avance ? Cette action est
                irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseDeleteDialog}>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteAdvance}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteAdvance.isPending}
              >
                {deleteAdvance.isPending ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthenticatedLayout>
  );
}
