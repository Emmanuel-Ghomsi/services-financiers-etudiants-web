'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useClientFiles } from '@/lib/api/hooks/use-client-files';
import { useClientFileStore } from '@/lib/stores/client-file-store';
import {
  ClientRegistrationStep,
  StepStatus,
  type ClientFileCreateRequest,
} from '@/types/client-file';
import { RegistrationStepsIndicator } from '@/components/client/registration-steps-indicator';
import { BasicInfoForm } from '@/components/client/basic-info-form';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NewClientPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const { createClientFile, isCreating } = useClientFiles();
  const { registrationProgress, setRegistrationProgress, createNewProgress } = useClientFileStore();

  const [error, setError] = useState<string | null>(null);

  // Initialiser la progression si nécessaire
  useEffect(() => {
    if (!registrationProgress.clientFileId) {
      const newProgress = createNewProgress();
      setRegistrationProgress(newProgress);
    }
  }, [registrationProgress.clientFileId, createNewProgress, setRegistrationProgress]);

  // Gérer la soumission du formulaire de base
  const handleBasicInfoSubmit = async (data: ClientFileCreateRequest) => {
    try {
      setError(null);

      // Créer la fiche client
      const result = await createClientFile(data);

      if (result) {
        // Mettre à jour la progression
        const updatedSteps = { ...registrationProgress.steps };
        updatedSteps[ClientRegistrationStep.BASIC_INFO] = StepStatus.COMPLETE;

        setRegistrationProgress({
          ...registrationProgress,
          clientFileId: result.id,
          currentStep: ClientRegistrationStep.IDENTITY,
          steps: updatedSteps,
        });

        // Rediriger vers la page de détail
        router.push(`/clients/${result.id}`);
      } else {
        setError('Échec de la création de la fiche client');
      }
    } catch (err) {
      console.error('Erreur lors de la création de la fiche client:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <AuthenticatedLayout title="Nouvel enregistrement client" userName={profile?.firstname || ''}>
      <Breadcrumb
        segments={[
          { name: 'Clients', href: '/clients' },
          { name: 'Nouvel enregistrement', href: '/clients/new' },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Enregistrement client</h1>
        <p className="text-muted-foreground">
          Complétez les informations de base pour créer une nouvelle fiche client
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white p-4 rounded-lg border mb-6">
        <RegistrationStepsIndicator
          currentStep={registrationProgress.currentStep}
          steps={registrationProgress.steps}
        />
      </div>

      <BasicInfoForm onSubmit={handleBasicInfoSubmit} isSubmitting={isCreating} />
    </AuthenticatedLayout>
  );
}
