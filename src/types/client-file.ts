import { z } from 'zod';

// Schéma de validation pour la création d'une fiche client
export const ClientFileCreateRequestSchema = z.object({
  reason: z.enum(['Entrée en relation', 'Revue périodique'], {
    errorMap: () => ({ message: 'Veuillez sélectionner un motif valide' }),
  }),
  clientType: z.enum(['Titulaire', 'Mandataire'], {
    errorMap: () => ({ message: 'Veuillez sélectionner un type de client valide' }),
  }),
  nonResident: z.boolean(),
});

export type ClientFileCreateRequest = z.infer<typeof ClientFileCreateRequestSchema>;

// Schéma de validation pour l'identité
export const ClientFileIdentityRequestSchema = z.object({
  lastName: z.string().min(1, 'Le nom est requis').optional(),
  firstName: z.string().min(1, 'Le prénom est requis').optional(),
  email: z.string().email('Email invalide').optional(),
  maidenName: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  birthCity: z.string().optional(),
  birthCountry: z.string().optional(),
  identityType: z.string().optional(),
  identityNumber: z.string().optional(),
  nationality: z.string().optional(),
  legalRepresentative: z.string().optional(),
  hasBankAccount: z.boolean().optional(),
  taxIdNumber: z.string().optional(),
  taxCountry: z.string().optional(),
});

export type ClientFileIdentityRequest = z.infer<typeof ClientFileIdentityRequestSchema>;

// Schéma de validation pour les coordonnées
export const ClientFileAddressRequestSchema = z.object({
  homeAddress: z.string().optional(),
  postalAddress: z.string().optional(),
  taxResidenceCountry: z.string().optional(),
  phoneNumbers: z.string().optional(),
});

export type ClientFileAddressRequest = z.infer<typeof ClientFileAddressRequestSchema>;

// Schéma de validation pour l'activité
export const ClientFileActivityRequestSchema = z.object({
  profession: z.string().optional(),
  businessSector: z.string().optional(),
  activityStartDate: z.coerce.date().optional(),
  activityArea: z.string().optional(),
});

export type ClientFileActivityRequest = z.infer<typeof ClientFileActivityRequestSchema>;

// Schéma de validation pour la situation
export const ClientFileSituationRequestSchema = z.object({
  incomeSources: z.string().optional(),
  monthlyIncome: z.coerce.number().optional(),
  incomeCurrency: z.string().optional(),
  fundsOriginDestination: z.string().optional(),
  assets: z.string().optional(),
});

export type ClientFileSituationRequest = z.infer<typeof ClientFileSituationRequestSchema>;

// Schéma de validation pour les transactions internationales
export const ClientFileInternationalRequestSchema = z.object({
  hasInternationalOps: z.boolean().optional(),
  transactionCountries: z.string().optional(),
  transactionCurrencies: z.string().optional(),
});

export type ClientFileInternationalRequest = z.infer<typeof ClientFileInternationalRequestSchema>;

// Schéma de validation pour les services
export const ClientFileServicesRequestSchema = z.object({
  offeredAccounts: z.string().optional(),
});

export type ClientFileServicesRequest = z.infer<typeof ClientFileServicesRequestSchema>;

// Schéma de validation pour le fonctionnement du compte
export const ClientFileOperationRequestSchema = z.object({
  expectedOperations: z.string().optional(),
  creditAmount: z.string().optional(),
  debitAmount: z.string().optional(),
});

export type ClientFileOperationRequest = z.infer<typeof ClientFileOperationRequestSchema>;

// Schéma de validation pour les PPE
export const ClientFilePepRequestSchema = z.object({
  isPEP: z.boolean().optional(),
  pepType: z.string().optional(),
  pepMandate: z.string().optional(),
  pepEndDate: z.coerce.date().optional(),
  pepLinkType: z.string().optional(),
  pepLastName: z.string().optional(),
  pepFirstName: z.string().optional(),
  pepBirthDate: z.coerce.date().optional(),
  pepBirthPlace: z.string().optional(),
});

export type ClientFilePepRequest = z.infer<typeof ClientFilePepRequestSchema>;

// Schéma de validation pour la conformité
export const ClientFileComplianceRequestSchema = z.object({
  riskLevel: z.string().optional(),
  classificationSource: z.string().optional(),
  degradationReason: z.string().optional(),
  fatcaStatus: z.string().optional(),
  hasUsIndications: z.boolean().optional(),
  usIndicationsDetails: z.string().optional(),
});

export type ClientFileComplianceRequest = z.infer<typeof ClientFileComplianceRequestSchema>;

// Schéma de validation pour l'origine des fonds
export const ClientFileFundOriginRequestSchema = z
  .object({
    fundSources: z
      .array(
        z.enum([
          'épargne personnel',
          'revenue familial',
          'bourse',
          'prêt étudiant',
          'Don financier',
          'Autre',
        ])
      )
      .optional(),
    fundProviderName: z.string().optional(),
    fundProviderRelation: z.string().optional(),
    fundDonationExplanation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.fundSources?.includes('Don financier') &&
      (!data.fundDonationExplanation || data.fundDonationExplanation.trim().length < 3)
    ) {
      ctx.addIssue({
        path: ['fundDonationExplanation'],
        code: z.ZodIssueCode.custom,
        message: 'Vous devez expliquer la provenance du don financier.',
      });
    }
  });

export type ClientFileFundOriginRequest = z.infer<typeof ClientFileFundOriginRequestSchema>;

// Étapes du processus d'enregistrement client
export enum ClientRegistrationStep {
  BASIC_INFO = 'basic_info',
  IDENTITY = 'identity',
  CONTACT = 'contact',
  PROFESSION = 'profession',
  FINANCIAL_SITUATION = 'financial_situation',
  TRANSACTIONS = 'transactions',
  SERVICES = 'services',
  OPERATION = 'operation',
  PEP_STATUS = 'pep_status',
  LBC_FT_CLASSIFICATION = 'lbc_ft_classification',
  FUND_ORIGIN = 'fund_origin',
  SUMMARY = 'summary',
}

// Statut de chaque étape
export enum StepStatus {
  NOT_STARTED = 'not_started',
  INCOMPLETE = 'incomplete',
  COMPLETE = 'complete',
  LOCKED = 'locked',
}

// Interface pour le DTO de fiche client
export interface ClientFileDTO {
  id: string;
  reference: string;
  clientCode: string;
  reason: string;
  clientType: string;
  nonResident: boolean;
  status: string;
  creatorId: string;
  creatorUsername?: string;

  lastName?: string | null;
  firstName?: string | null;
  email?: string | null;
  maidenName?: string | null;
  birthDate?: Date | null;
  birthCity?: string | null;
  birthCountry?: string | null;
  identityType?: string | null;
  identityNumber?: string | null;
  nationality?: string | null;
  legalRepresentative?: string | null;
  hasBankAccount?: boolean | null;
  taxIdNumber?: string | null;
  taxCountry?: string | null;

  homeAddress?: string | null;
  postalAddress?: string | null;
  taxResidenceCountry?: string | null;
  phoneNumbers?: string | null;

  profession?: string | null;
  businessSector?: string | null;
  activityStartDate?: Date | null;
  activityArea?: string | null;

  incomeSources?: string | null;
  monthlyIncome?: number | null;
  incomeCurrency?: string | null;
  fundsOriginDestination?: string | null;
  assets?: string | null;

  hasInternationalOps?: boolean | null;
  transactionCountries?: string | null;
  transactionCurrencies?: string | null;

  offeredAccounts?: string | null;
  expectedOperations?: string | null;
  creditAmount?: string | null;
  debitAmount?: string | null;

  isPEP?: boolean | null;
  pepType?: string | null;
  pepMandate?: string | null;
  pepEndDate?: Date | null;
  pepLinkType?: string | null;
  pepLastName?: string | null;
  pepFirstName?: string | null;
  pepBirthDate?: Date | null;
  pepBirthPlace?: string | null;

  riskLevel?: string | null;
  classificationSource?: string | null;
  degradationReason?: string | null;
  fatcaStatus?: string | null;
  hasUsIndications?: boolean | null;
  usIndicationsDetails?: string | null;

  validatorAdminId?: string | null;
  validatorSuperAdminId?: string | null;
  validationDateAdmin?: Date | null;
  validationDateSuper?: Date | null;
  rejectionReason?: string | null;

  fundSources?: string[] | null;
  fundProviderName?: string | null;
  fundProviderRelation?: string | null;
  fundDonationExplanation?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

// Interface pour le suivi de progression des étapes
export interface RegistrationProgress {
  currentStep: ClientRegistrationStep;
  steps: Record<ClientRegistrationStep, StepStatus>;
  clientFileId?: string;
}

// ✅ Requête pour pagination + filtres
export interface ClientFileListRequest {
  page: number;
  pageSize: number;
  pageLimit: number;
  filters?: {
    reference?: string;
    lastName?: string;
    clientCode?: string;
    status?: string;
    email?: string;
  };
}

// ✅ Structure de retour paginée
export interface ClientFilePaginationDTO {
  clientFiles: ClientFileDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageLimit: number;
}
