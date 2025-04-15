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
import { AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ClientFileStatusBadge } from '@/components/client/client-file-status-badge';
import { useClientFilePermissions } from '@/hooks/use-client-file-permissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from '@/hooks/use-toast';

export default function ViewClientFilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const { toast } = useToast();

  const { profile } = useProfile();
  const {
    clientFile,
    isLoading,
    error: fetchError,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectFile,
  } = useClientFile(clientId);

  const { generateProgressFromClientFile } = useClientFileStore();
  const permissions = useClientFilePermissions();

  const [currentStep, setCurrentStep] = useState<ClientRegistrationStep>(
    ClientRegistrationStep.BASIC_INFO
  );
  const [steps, setSteps] = useState<Record<ClientRegistrationStep, StepStatus>>(
    {} as Record<ClientRegistrationStep, StepStatus>
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser les étapes une fois que le fichier client est chargé
  useEffect(() => {
    if (clientFile && !isInitialized) {
      // Générer la progression en une seule opération
      const newProgress = generateProgressFromClientFile(clientFile);
      setCurrentStep(newProgress.currentStep);
      setSteps(newProgress.steps);
      setIsInitialized(true);
    }
  }, [clientFile, isInitialized, generateProgressFromClientFile]);

  // Gérer le changement d'étape
  const handleStepClick = (step: ClientRegistrationStep) => {
    // Ne permettre de naviguer que vers les étapes non verrouillées
    if (steps[step] !== StepStatus.LOCKED) {
      setCurrentStep(step);
    }
  };

  // Gérer la validation par un admin
  const handleValidateAsAdmin = async () => {
    try {
      setIsSubmitting(true);
      await validateAsAdmin(); // Ne pas passer clientId
      toast({
        title: 'Succès',
        description: 'La fiche client a été validée avec succès',
      });
      router.push('/clients');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de valider la fiche client',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la validation par un super admin
  const handleValidateAsSuperAdmin = async () => {
    try {
      setIsSubmitting(true);
      await validateAsSuperAdmin(); // Ne pas passer clientId
      toast({
        title: 'Succès',
        description: 'La fiche client a été validée avec succès',
      });
      router.push('/clients');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de valider la fiche client',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer le rejet de la fiche
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez indiquer une raison de rejet',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await rejectFile(rejectReason); // Ne passer que la raison, pas clientId
      toast({
        title: 'Succès',
        description: 'La fiche client a été rejetée',
      });
      setRejectDialogOpen(false);
      router.push('/clients');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de rejeter la fiche client',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
          <p className="mt-4 text-lg text-gray-600">Initialisation de la vue...</p>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Détails de la fiche client" userName={profile?.firstname || ''}>
      <Breadcrumb
        segments={[
          { name: 'Clients', href: '/clients' },
          { name: clientFile.reference || 'Client', href: `/clients/${clientId}/view` },
        ]}
      />

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Détails de la fiche client</h1>
            <p className="text-muted-foreground">
              Référence: {clientFile.reference} - Client: {clientFile.clientCode}
            </p>
          </div>
          <ClientFileStatusBadge status={clientFile.status} className="text-sm" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border mb-6">
        <RegistrationStepsIndicator
          currentStep={currentStep}
          steps={steps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Afficher les informations de l'étape actuelle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {currentStep === ClientRegistrationStep.BASIC_INFO && 'Informations de base'}
            {currentStep === ClientRegistrationStep.IDENTITY && 'Identité'}
            {currentStep === ClientRegistrationStep.CONTACT && 'Coordonnées'}
            {currentStep === ClientRegistrationStep.PROFESSION && 'Profession'}
            {currentStep === ClientRegistrationStep.FINANCIAL_SITUATION && 'Situation financière'}
            {currentStep === ClientRegistrationStep.TRANSACTIONS && 'Transactions internationales'}
            {currentStep === ClientRegistrationStep.SERVICES && 'Services'}
            {currentStep === ClientRegistrationStep.OPERATION && 'Opérations'}
            {currentStep === ClientRegistrationStep.PEP_STATUS && 'Statut PPE'}
            {currentStep === ClientRegistrationStep.LBC_FT_CLASSIFICATION &&
              'Classification LBC/FT'}
            {currentStep === ClientRegistrationStep.FUND_ORIGIN && 'Origine des fonds'}
            {currentStep === ClientRegistrationStep.SUMMARY && 'Résumé'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Informations de base */}
          {currentStep === ClientRegistrationStep.BASIC_INFO && (
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
          )}

          {/* Identité */}
          {currentStep === ClientRegistrationStep.IDENTITY && (
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
                  {clientFile.birthDate ? new Date(clientFile.birthDate).toLocaleDateString() : '-'}
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
              <div>
                <p className="text-sm font-medium">Type de pièce d'identité</p>
                <p className="text-sm">{clientFile.identityType || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Numéro de pièce d'identité</p>
                <p className="text-sm">{clientFile.identityNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Représentant légal</p>
                <p className="text-sm">{clientFile.legalRepresentative || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Possède un compte bancaire</p>
                <p className="text-sm">{clientFile.hasBankAccount ? 'Oui' : 'Non'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Numéro d'identification fiscale</p>
                <p className="text-sm">{clientFile.taxIdNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Pays d'imposition</p>
                <p className="text-sm">{clientFile.taxCountry || '-'}</p>
              </div>
            </div>
          )}

          {/* Coordonnées */}
          {currentStep === ClientRegistrationStep.CONTACT && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Adresse du domicile</p>
                <p className="text-sm whitespace-pre-line">{clientFile.homeAddress || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Adresse postale</p>
                <p className="text-sm whitespace-pre-line">{clientFile.postalAddress || '-'}</p>
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
          )}

          {/* Profession */}
          {currentStep === ClientRegistrationStep.PROFESSION && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Profession</p>
                <p className="text-sm">{clientFile.profession || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Secteur d'activité</p>
                <p className="text-sm">{clientFile.businessSector || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date de début d'activité</p>
                <p className="text-sm">
                  {clientFile.activityStartDate
                    ? new Date(clientFile.activityStartDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Zone d'activité</p>
                <p className="text-sm">{clientFile.activityArea || '-'}</p>
              </div>
            </div>
          )}

          {/* Situation financière */}
          {currentStep === ClientRegistrationStep.FINANCIAL_SITUATION && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Sources de revenus</p>
                <p className="text-sm whitespace-pre-line">{clientFile.incomeSources || '-'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Revenu mensuel</p>
                  <p className="text-sm">{clientFile.monthlyIncome || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Devise</p>
                  <p className="text-sm">{clientFile.incomeCurrency || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Origine et destination des fonds</p>
                <p className="text-sm whitespace-pre-line">
                  {clientFile.fundsOriginDestination || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Patrimoine</p>
                <p className="text-sm whitespace-pre-line">{clientFile.assets || '-'}</p>
              </div>
            </div>
          )}

          {/* Transactions internationales */}
          {currentStep === ClientRegistrationStep.TRANSACTIONS && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Opérations internationales</p>
                <p className="text-sm">{clientFile.hasInternationalOps ? 'Oui' : 'Non'}</p>
              </div>
              {clientFile.hasInternationalOps && (
                <>
                  <div>
                    <p className="text-sm font-medium">Pays concernés</p>
                    <p className="text-sm">{clientFile.transactionCountries || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Devises utilisées</p>
                    <p className="text-sm">{clientFile.transactionCurrencies || '-'}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Services */}
          {currentStep === ClientRegistrationStep.SERVICES && (
            <div>
              <p className="text-sm font-medium">Comptes et services proposés</p>
              <p className="text-sm whitespace-pre-line">{clientFile.offeredAccounts || '-'}</p>
            </div>
          )}

          {/* Opérations */}
          {currentStep === ClientRegistrationStep.OPERATION && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Opérations attendues</p>
                <p className="text-sm whitespace-pre-line">
                  {clientFile.expectedOperations || '-'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Montant des crédits</p>
                  <p className="text-sm">{clientFile.creditAmount || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Montant des débits</p>
                  <p className="text-sm">{clientFile.debitAmount || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statut PPE */}
          {currentStep === ClientRegistrationStep.PEP_STATUS && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Est une Personne Politiquement Exposée (PPE)</p>
                <p className="text-sm">{clientFile.isPEP ? 'Oui' : 'Non'}</p>
              </div>
              {clientFile.isPEP && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Type de PPE</p>
                      <p className="text-sm">{clientFile.pepType || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mandat politique</p>
                      <p className="text-sm">{clientFile.pepMandate || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date de fin de mandat</p>
                      <p className="text-sm">
                        {clientFile.pepEndDate
                          ? new Date(clientFile.pepEndDate).toLocaleDateString()
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type de lien avec la PPE</p>
                      <p className="text-sm">{clientFile.pepLinkType || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Nom de la PPE</p>
                      <p className="text-sm">{clientFile.pepLastName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Prénom de la PPE</p>
                      <p className="text-sm">{clientFile.pepFirstName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date de naissance de la PPE</p>
                      <p className="text-sm">
                        {clientFile.pepBirthDate
                          ? new Date(clientFile.pepBirthDate).toLocaleDateString()
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Lieu de naissance de la PPE</p>
                      <p className="text-sm">{clientFile.pepBirthPlace || '-'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Classification LBC/FT */}
          {currentStep === ClientRegistrationStep.LBC_FT_CLASSIFICATION && (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Niveau de risque LBC/FT</p>
                  <p className="text-sm">{clientFile.riskLevel || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Source de la classification</p>
                  <p className="text-sm">{clientFile.classificationSource || '-'}</p>
                </div>
              </div>
              {clientFile.riskLevel === 'Élevé' && (
                <div>
                  <p className="text-sm font-medium">
                    Raison de la dégradation du niveau de risque
                  </p>
                  <p className="text-sm whitespace-pre-line">
                    {clientFile.degradationReason || '-'}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Statut FATCA</p>
                  <p className="text-sm">{clientFile.fatcaStatus || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Présence d'indices US</p>
                  <p className="text-sm">{clientFile.hasUsIndications ? 'Oui' : 'Non'}</p>
                </div>
              </div>
              {clientFile.hasUsIndications && (
                <div>
                  <p className="text-sm font-medium">Détails des indices US</p>
                  <p className="text-sm whitespace-pre-line">
                    {clientFile.usIndicationsDetails || '-'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Origine des fonds */}
          {currentStep === ClientRegistrationStep.FUND_ORIGIN && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Sources des fonds</p>
                <p className="text-sm">
                  {clientFile.fundSources && clientFile.fundSources.length > 0
                    ? clientFile.fundSources.join(', ')
                    : '-'}
                </p>
              </div>
              {clientFile.fundSources && clientFile.fundSources.includes('Don financier') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Nom du donateur</p>
                      <p className="text-sm">{clientFile.fundProviderName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Relation avec le donateur</p>
                      <p className="text-sm">{clientFile.fundProviderRelation || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Explication du don</p>
                    <p className="text-sm whitespace-pre-line">
                      {clientFile.fundDonationExplanation || '-'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Résumé */}
          {currentStep === ClientRegistrationStep.SUMMARY && (
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
                    <p className="text-sm font-medium">Numéros de téléphone</p>
                    <p className="text-sm">{clientFile.phoneNumbers || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Boutons de validation/rejet pour les administrateurs */}
        {(permissions.canValidateAsAdmin(clientFile) ||
          permissions.canValidateAsSuperAdmin(clientFile)) && (
          <CardFooter className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(true)}
              className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
            {permissions.canValidateAsAdmin(clientFile) && (
              <Button
                onClick={handleValidateAsAdmin}
                className="bg-brand-blue hover:bg-brand-blue-light"
                disabled={isSubmitting}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Valider (Admin)
              </Button>
            )}
            {permissions.canValidateAsSuperAdmin(clientFile) && (
              <Button
                onClick={handleValidateAsSuperAdmin}
                className="bg-brand-blue hover:bg-brand-blue-light"
                disabled={isSubmitting}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Valider (Super Admin)
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Dialogue de rejet */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rejeter la fiche client</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet. Cette information sera communiquée au créateur
              de la fiche.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Raison du rejet..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
            {rejectReason.trim().length === 0 && (
              <p className="text-sm text-red-500 mt-2">La raison du rejet est obligatoire</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <LoadingButton
              onClick={handleReject}
              isLoading={isSubmitting}
              loadingText="Envoi en cours..."
              disabled={rejectReason.trim().length === 0}
            >
              Rejeter la fiche
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
