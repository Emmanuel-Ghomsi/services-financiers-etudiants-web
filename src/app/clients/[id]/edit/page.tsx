'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useClientFile } from '@/lib/api/hooks/use-client-file';
import { useClientFileStore } from '@/lib/stores/client-file-store';
import { ClientRegistrationStep, StepStatus } from '@/types/client-file';
import { RegistrationStepsIndicator } from '@/components/client/registration-steps-indicator';
import { BasicInfoForm } from '@/components/client/basic-info-form';
import { IdentityForm } from '@/components/client/identity-form';
import { AddressForm } from '@/components/client/address-form';
import { ActivityForm } from '@/components/client/activity-form';
import { SituationForm } from '@/components/client/situation-form';
import { InternationalForm } from '@/components/client/international-form';
import { ServicesForm } from '@/components/client/services-form';
import { OperationForm } from '@/components/client/operation-form';
import { PepForm } from '@/components/client/pep-form';
import { ComplianceForm } from '@/components/client/compliance-form';
import { FundOriginForm } from '@/components/client/fund-origin-form';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Définir les sources de fonds valides
const VALID_FUND_SOURCES = [
  'épargne personnel',
  'revenue familial',
  'bourse',
  'prêt étudiant',
  'Don financier',
  'Autre',
] as const;
type FundSourceType = (typeof VALID_FUND_SOURCES)[number];

export default function EditClientFilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const { profile } = useProfile();
  const {
    clientFile,
    isLoading,
    error: fetchError,
    updateClientFile,
    isUpdating,
    updateIdentity,
    isUpdatingIdentity,
    updateAddress,
    isUpdatingAddress,
    updateActivity,
    isUpdatingActivity,
    updateSituation,
    isUpdatingSituation,
    updateInternational,
    isUpdatingInternational,
    updateServices,
    isUpdatingServices,
    updateOperation,
    isUpdatingOperation,
    updatePep,
    isUpdatingPep,
    updateCompliance,
    isUpdatingCompliance,
    updateFundOrigin,
    isUpdatingFundOrigin,
  } = useClientFile(clientId);

  const { registrationProgress, setRegistrationProgress, generateProgressFromClientFile } =
    useClientFileStore();

  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser la progression une fois que le fichier client est chargé
  useEffect(() => {
    if (clientFile && !isInitialized) {
      // Générer la progression en une seule opération
      const newProgress = generateProgressFromClientFile(clientFile);

      // Mettre à jour l'état en une seule fois
      setRegistrationProgress(newProgress);

      // Marquer comme initialisé
      setIsInitialized(true);
    }
  }, [clientFile, isInitialized, generateProgressFromClientFile, setRegistrationProgress]);

  // Gérer le changement d'étape
  const handleStepClick = (step: ClientRegistrationStep) => {
    // Ne permettre de naviguer que vers les étapes non verrouillées
    if (registrationProgress.steps[step] !== StepStatus.LOCKED) {
      setRegistrationProgress({
        ...registrationProgress,
        currentStep: step,
      });
    }
  };

  // Créer une fonction pour mettre à jour la progression après un succès
  const updateProgressAfterSuccess = (
    completedStep: ClientRegistrationStep,
    nextStep: ClientRegistrationStep
  ) => {
    const updatedSteps = { ...registrationProgress.steps };
    updatedSteps[completedStep] = StepStatus.COMPLETE;

    // Débloquer l'étape suivante si nécessaire
    if (updatedSteps[nextStep] === StepStatus.LOCKED) {
      updatedSteps[nextStep] = StepStatus.NOT_STARTED;
    }

    setRegistrationProgress({
      ...registrationProgress,
      steps: updatedSteps,
      currentStep: nextStep,
    });
  };

  // Gérer la soumission du formulaire d'informations de base
  const handleBasicInfoUpdate = async (data: any) => {
    try {
      setError(null);
      const result = await updateClientFile(clientId, data);
      if (result) {
        updateProgressAfterSuccess(
          ClientRegistrationStep.BASIC_INFO,
          ClientRegistrationStep.IDENTITY
        );
      } else {
        setError('Échec de la mise à jour de la fiche client');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la fiche client:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire d'identité
  const handleIdentityUpdate = async (data: any) => {
    try {
      setError(null);
      await updateIdentity(data);
      updateProgressAfterSuccess(ClientRegistrationStep.IDENTITY, ClientRegistrationStep.CONTACT);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'identité:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire d'adresse
  const handleAddressUpdate = async (data: any) => {
    try {
      setError(null);
      await updateAddress(data);
      updateProgressAfterSuccess(ClientRegistrationStep.CONTACT, ClientRegistrationStep.PROFESSION);
    } catch (err) {
      console.error('Erreur lors de la mise à jour des coordonnées:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire d'activité
  const handleActivityUpdate = async (data: any) => {
    try {
      setError(null);
      await updateActivity(data);
      updateProgressAfterSuccess(
        ClientRegistrationStep.PROFESSION,
        ClientRegistrationStep.FINANCIAL_SITUATION
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'activité:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire de situation
  const handleSituationUpdate = async (data: any) => {
    try {
      setError(null);
      await updateSituation(data);
      updateProgressAfterSuccess(
        ClientRegistrationStep.FINANCIAL_SITUATION,
        ClientRegistrationStep.TRANSACTIONS
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la situation:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire de transactions internationales
  const handleInternationalUpdate = async (data: any) => {
    try {
      setError(null);
      await updateInternational(data);
      updateProgressAfterSuccess(
        ClientRegistrationStep.TRANSACTIONS,
        ClientRegistrationStep.SERVICES
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour des transactions internationales:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire de services
  const handleServicesUpdate = async (data: any) => {
    try {
      setError(null);
      await updateServices(data);
      updateProgressAfterSuccess(ClientRegistrationStep.SERVICES, ClientRegistrationStep.OPERATION);
    } catch (err) {
      console.error('Erreur lors de la mise à jour des services:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire d'opération
  const handleOperationUpdate = async (data: any) => {
    try {
      setError(null);
      await updateOperation(data);
      updateProgressAfterSuccess(
        ClientRegistrationStep.OPERATION,
        ClientRegistrationStep.PEP_STATUS
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour des opérations:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire PEP
  const handlePepUpdate = async (data: any) => {
    try {
      setError(null);
      await updatePep(data);
      updateProgressAfterSuccess(
        ClientRegistrationStep.PEP_STATUS,
        ClientRegistrationStep.LBC_FT_CLASSIFICATION
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour des informations PEP:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire de conformité
  const handleComplianceUpdate = async (data: any) => {
    try {
      setError(null);
      await updateCompliance(data);
      updateProgressAfterSuccess(
        ClientRegistrationStep.LBC_FT_CLASSIFICATION,
        ClientRegistrationStep.FUND_ORIGIN
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la conformité:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Gérer la soumission du formulaire d'origine des fonds
  const handleFundOriginUpdate = async (data: any) => {
    try {
      setError(null);
      await updateFundOrigin(data);
      updateProgressAfterSuccess(
        ClientRegistrationStep.FUND_ORIGIN,
        ClientRegistrationStep.SUMMARY
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'origine des fonds:", err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <AuthenticatedLayout title="Chargement..." userName={profile?.firstname || ''}>
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
          <p className="mt-4 text-lg text-gray-600">Chargement des informations client...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Afficher une erreur
  if (fetchError || !clientFile) {
    return (
      <AuthenticatedLayout title="Erreur" userName={profile?.firstname || ''}>
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">
            Impossible de charger les informations client
          </h2>
          <p className="mt-2 text-gray-600">
            {fetchError instanceof Error ? fetchError.message : 'Fiche client introuvable'}
          </p>
          <Button onClick={() => router.push('/clients')} className="mt-6" variant="outline">
            Retour à la liste des clients
          </Button>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Si la progression n'est pas encore initialisée, afficher un chargement
  if (!isInitialized) {
    return (
      <AuthenticatedLayout title="Initialisation..." userName={profile?.firstname || ''}>
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
          <p className="mt-4 text-lg text-gray-600">Initialisation du formulaire...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Édition de la fiche client" userName={profile?.firstname || ''}>
      <Breadcrumb
        segments={[
          { name: 'Clients', href: '/clients' },
          { name: clientFile.reference || 'Client', href: `/clients/${clientId}` },
          { name: 'Édition', href: `/clients/${clientId}/edit` },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Édition de la fiche client</h1>
        <p className="text-muted-foreground">
          Référence: {clientFile.reference} - Client: {clientFile.clientCode}
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
          onStepClick={handleStepClick}
        />
      </div>

      {/* Afficher l'étape actuelle */}
      {registrationProgress.currentStep === ClientRegistrationStep.BASIC_INFO && (
        <BasicInfoForm
          onSubmit={handleBasicInfoUpdate}
          isSubmitting={isUpdating}
          defaultValues={{
            reference: clientFile.reference,
            clientCode: clientFile.clientCode,
            reason: clientFile.reason as any,
            clientType: clientFile.clientType as any,
            nonResident: clientFile.nonResident,
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.IDENTITY && (
        <IdentityForm
          onSubmit={handleIdentityUpdate}
          isSubmitting={isUpdatingIdentity}
          defaultValues={{
            lastName: clientFile.lastName || '',
            firstName: clientFile.firstName || '',
            email: clientFile.email || '',
            maidenName: clientFile.maidenName || '',
            birthDate: clientFile.birthDate || undefined,
            birthCity: clientFile.birthCity || '',
            birthCountry: clientFile.birthCountry || '',
            identityType: clientFile.identityType || '',
            identityNumber: clientFile.identityNumber || '',
            nationality: clientFile.nationality || '',
            legalRepresentative: clientFile.legalRepresentative || '',
            hasBankAccount: clientFile.hasBankAccount || false,
            taxIdNumber: clientFile.taxIdNumber || '',
            taxCountry: clientFile.taxCountry || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.CONTACT && (
        <AddressForm
          onSubmit={handleAddressUpdate}
          isSubmitting={isUpdatingAddress}
          defaultValues={{
            homeAddress: clientFile.homeAddress || '',
            postalAddress: clientFile.postalAddress || '',
            taxResidenceCountry: clientFile.taxResidenceCountry || '',
            phoneNumbers: clientFile.phoneNumbers || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.PROFESSION && (
        <ActivityForm
          onSubmit={handleActivityUpdate}
          isSubmitting={isUpdatingActivity}
          defaultValues={{
            profession: clientFile.profession || '',
            businessSector: clientFile.businessSector || '',
            activityStartDate: clientFile.activityStartDate || undefined,
            activityArea: clientFile.activityArea || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.FINANCIAL_SITUATION && (
        <SituationForm
          onSubmit={handleSituationUpdate}
          isSubmitting={isUpdatingSituation}
          defaultValues={{
            incomeSources: clientFile.incomeSources || '',
            monthlyIncome: clientFile.monthlyIncome || undefined,
            incomeCurrency: clientFile.incomeCurrency || '',
            fundsOriginDestination: clientFile.fundsOriginDestination || '',
            assets: clientFile.assets || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.TRANSACTIONS && (
        <InternationalForm
          onSubmit={handleInternationalUpdate}
          isSubmitting={isUpdatingInternational}
          defaultValues={{
            hasInternationalOps: clientFile.hasInternationalOps || false,
            transactionCountries: clientFile.transactionCountries || '',
            transactionCurrencies: clientFile.transactionCurrencies || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.SERVICES && (
        <ServicesForm
          onSubmit={handleServicesUpdate}
          isSubmitting={isUpdatingServices}
          defaultValues={{
            offeredAccounts: clientFile.offeredAccounts || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.OPERATION && (
        <OperationForm
          onSubmit={handleOperationUpdate}
          isSubmitting={isUpdatingOperation}
          defaultValues={{
            expectedOperations: clientFile.expectedOperations || '',
            creditAmount: clientFile.creditAmount || '',
            debitAmount: clientFile.debitAmount || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.PEP_STATUS && (
        <PepForm
          onSubmit={handlePepUpdate}
          isSubmitting={isUpdatingPep}
          defaultValues={{
            isPEP: clientFile.isPEP || false,
            pepType: clientFile.pepType || '',
            pepMandate: clientFile.pepMandate || '',
            pepEndDate: clientFile.pepEndDate || undefined,
            pepLinkType: clientFile.pepLinkType || '',
            pepLastName: clientFile.pepLastName || '',
            pepFirstName: clientFile.pepFirstName || '',
            pepBirthDate: clientFile.pepBirthDate || undefined,
            pepBirthPlace: clientFile.pepBirthPlace || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.LBC_FT_CLASSIFICATION && (
        <ComplianceForm
          onSubmit={handleComplianceUpdate}
          isSubmitting={isUpdatingCompliance}
          defaultValues={{
            riskLevel: clientFile.riskLevel || '',
            classificationSource: clientFile.classificationSource || '',
            degradationReason: clientFile.degradationReason || '',
            fatcaStatus: clientFile.fatcaStatus || '',
            hasUsIndications: clientFile.hasUsIndications || false,
            usIndicationsDetails: clientFile.usIndicationsDetails || '',
          }}
        />
      )}

      {registrationProgress.currentStep === ClientRegistrationStep.FUND_ORIGIN && (
        <FundOriginForm
          onSubmit={handleFundOriginUpdate}
          isSubmitting={isUpdatingFundOrigin}
          defaultValues={{
            fundSources: clientFile.fundSources?.filter((source) =>
              VALID_FUND_SOURCES.includes(source as FundSourceType)
            ) as FundSourceType[],
            fundProviderName: clientFile.fundProviderName || '',
            fundProviderRelation: clientFile.fundProviderRelation || '',
            fundDonationExplanation: clientFile.fundDonationExplanation || '',
          }}
        />
      )}

      {/* Afficher un résumé des informations de la fiche client */}
      {registrationProgress.currentStep === ClientRegistrationStep.SUMMARY && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Résumé de la fiche client</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Informations de base</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Référence</p>
                    <p className="text-sm">{clientFile.reference}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Code client</p>
                    <p className="text-sm">{clientFile.clientCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Type de client</p>
                    <p className="text-sm">{clientFile.clientType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Motif</p>
                    <p className="text-sm">{clientFile.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Non-résident</p>
                    <p className="text-sm">{clientFile.nonResident ? 'Oui' : 'Non'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Identité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nom</p>
                    <p className="text-sm">{clientFile.lastName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Prénom</p>
                    <p className="text-sm">{clientFile.firstName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{clientFile.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nom de jeune fille</p>
                    <p className="text-sm">{clientFile.maidenName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date de naissance</p>
                    <p className="text-sm">
                      {clientFile.birthDate
                        ? new Date(clientFile.birthDate).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ville de naissance</p>
                    <p className="text-sm">{clientFile.birthCity || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pays de naissance</p>
                    <p className="text-sm">{clientFile.birthCountry || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nationalité</p>
                    <p className="text-sm">{clientFile.nationality || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Coordonnées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Adresse du domicile</p>
                    <p className="text-sm">{clientFile.homeAddress || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Adresse postale</p>
                    <p className="text-sm">{clientFile.postalAddress || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pays de résidence fiscale</p>
                    <p className="text-sm">{clientFile.taxResidenceCountry || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Numéros de téléphone</p>
                    <p className="text-sm">{clientFile.phoneNumbers || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => router.push('/clients')}
                  className="bg-brand-blue hover:bg-brand-blue-light"
                >
                  Terminer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AuthenticatedLayout>
  );
}
