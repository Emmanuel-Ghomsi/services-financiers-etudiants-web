import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ClientFileDTO, RegistrationProgress } from '@/types/client-file';
import { ClientRegistrationStep, StepStatus } from '@/types/client-file';

interface ClientFileState {
  // État de la liste des fiches clients
  clientFiles: ClientFileDTO[];
  isLoading: boolean;
  error: string | null;

  // État de la fiche client en cours d'édition
  currentClientFile: ClientFileDTO | null;

  // État de progression de l'enregistrement
  registrationProgress: RegistrationProgress;

  // Actions
  setClientFiles: (clientFiles: ClientFileDTO[]) => void;
  setCurrentClientFile: (clientFile: ClientFileDTO | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Remplacer les mises à jour individuelles par une seule fonction qui met à jour tout en une fois
  setRegistrationProgress: (progress: RegistrationProgress) => void;

  // Méthodes auxiliaires qui ne mettent pas à jour l'état (pure functions)
  getNextStep: (
    currentStep: ClientRegistrationStep,
    steps: Record<ClientRegistrationStep, StepStatus>
  ) => ClientRegistrationStep | null;

  // Créer une nouvelle progression
  createNewProgress: (clientFileId?: string) => RegistrationProgress;

  // Générer une progression basée sur un fichier client
  generateProgressFromClientFile: (clientFile: ClientFileDTO) => RegistrationProgress;
}

// Ordre des étapes pour déterminer la progression
const STEP_ORDER: ClientRegistrationStep[] = [
  ClientRegistrationStep.BASIC_INFO,
  ClientRegistrationStep.IDENTITY,
  ClientRegistrationStep.CONTACT,
  ClientRegistrationStep.PROFESSION,
  ClientRegistrationStep.FINANCIAL_SITUATION,
  ClientRegistrationStep.TRANSACTIONS,
  ClientRegistrationStep.SERVICES,
  ClientRegistrationStep.OPERATION,
  ClientRegistrationStep.PEP_STATUS,
  ClientRegistrationStep.LBC_FT_CLASSIFICATION,
  ClientRegistrationStep.FUND_ORIGIN,
  ClientRegistrationStep.SUMMARY,
];

// État initial de la progression
const initialProgress: RegistrationProgress = {
  currentStep: ClientRegistrationStep.BASIC_INFO,
  steps: {
    [ClientRegistrationStep.BASIC_INFO]: StepStatus.NOT_STARTED,
    [ClientRegistrationStep.IDENTITY]: StepStatus.LOCKED,
    [ClientRegistrationStep.CONTACT]: StepStatus.LOCKED,
    [ClientRegistrationStep.PROFESSION]: StepStatus.LOCKED,
    [ClientRegistrationStep.FINANCIAL_SITUATION]: StepStatus.LOCKED,
    [ClientRegistrationStep.TRANSACTIONS]: StepStatus.LOCKED,
    [ClientRegistrationStep.SERVICES]: StepStatus.LOCKED,
    [ClientRegistrationStep.OPERATION]: StepStatus.LOCKED,
    [ClientRegistrationStep.PEP_STATUS]: StepStatus.LOCKED,
    [ClientRegistrationStep.LBC_FT_CLASSIFICATION]: StepStatus.LOCKED,
    [ClientRegistrationStep.FUND_ORIGIN]: StepStatus.LOCKED,
    [ClientRegistrationStep.SUMMARY]: StepStatus.LOCKED,
  },
  clientFileId: undefined,
};

export const useClientFileStore = create<ClientFileState>()(
  persist(
    (set, get) => ({
      // État initial
      clientFiles: [],
      currentClientFile: null,
      isLoading: false,
      error: null,
      registrationProgress: { ...initialProgress },

      // Actions
      setClientFiles: (clientFiles) => set({ clientFiles }),
      setCurrentClientFile: (clientFile) => set({ currentClientFile: clientFile }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Mettre à jour la progression complète en une seule opération
      setRegistrationProgress: (progress) => set({ registrationProgress: progress }),

      // Créer une nouvelle progression (fonction pure)
      createNewProgress: (clientFileId) => ({
        ...initialProgress,
        clientFileId,
      }),

      // Générer une progression basée sur un fichier client (fonction pure)
      generateProgressFromClientFile: (clientFile) => {
        // Copier l'état initial
        const progress = { ...initialProgress, clientFileId: clientFile.id };
        const steps = { ...progress.steps };

        // Mettre à jour l'état des étapes en fonction des données disponibles
        if (
          clientFile.reference &&
          clientFile.clientCode &&
          clientFile.reason &&
          clientFile.clientType !== undefined
        ) {
          steps[ClientRegistrationStep.BASIC_INFO] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.IDENTITY] = StepStatus.NOT_STARTED;
        }

        if (clientFile.lastName && clientFile.firstName) {
          steps[ClientRegistrationStep.IDENTITY] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.CONTACT] = StepStatus.NOT_STARTED;
        }

        if (clientFile.homeAddress) {
          steps[ClientRegistrationStep.CONTACT] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.PROFESSION] = StepStatus.NOT_STARTED;
        }

        if (clientFile.profession) {
          steps[ClientRegistrationStep.PROFESSION] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.FINANCIAL_SITUATION] = StepStatus.NOT_STARTED;
        }

        if (clientFile.incomeSources) {
          steps[ClientRegistrationStep.FINANCIAL_SITUATION] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.TRANSACTIONS] = StepStatus.NOT_STARTED;
        }

        if (clientFile.hasInternationalOps !== null) {
          steps[ClientRegistrationStep.TRANSACTIONS] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.SERVICES] = StepStatus.NOT_STARTED;
        }

        if (clientFile.offeredAccounts) {
          steps[ClientRegistrationStep.SERVICES] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.OPERATION] = StepStatus.NOT_STARTED;
        }

        if (clientFile.expectedOperations) {
          steps[ClientRegistrationStep.OPERATION] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.PEP_STATUS] = StepStatus.NOT_STARTED;
        }

        if (clientFile.isPEP !== null) {
          steps[ClientRegistrationStep.PEP_STATUS] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.LBC_FT_CLASSIFICATION] = StepStatus.NOT_STARTED;
        }

        if (clientFile.riskLevel) {
          steps[ClientRegistrationStep.LBC_FT_CLASSIFICATION] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.FUND_ORIGIN] = StepStatus.NOT_STARTED;
        }

        if (clientFile.fundSources) {
          steps[ClientRegistrationStep.FUND_ORIGIN] = StepStatus.COMPLETE;
          steps[ClientRegistrationStep.SUMMARY] = StepStatus.NOT_STARTED;
        }

        // Débloquer toutes les étapes précédentes pour permettre la navigation
        for (let i = 0; i < STEP_ORDER.length; i++) {
          const step = STEP_ORDER[i];

          // Si nous avons atteint une étape complète, débloquer toutes les étapes précédentes
          if (steps[step] === StepStatus.COMPLETE) {
            for (let j = 0; j <= i; j++) {
              const prevStep = STEP_ORDER[j];
              if (steps[prevStep] === StepStatus.LOCKED) {
                steps[prevStep] = StepStatus.NOT_STARTED;
              }
            }
          }

          // Débloquer l'étape suivante après une étape complète
          if (steps[step] === StepStatus.COMPLETE && i < STEP_ORDER.length - 1) {
            const nextStep = STEP_ORDER[i + 1];
            if (steps[nextStep] === StepStatus.LOCKED) {
              steps[nextStep] = StepStatus.NOT_STARTED;
            }
          }
        }

        // Déterminer l'étape actuelle
        let currentStep = ClientRegistrationStep.BASIC_INFO;

        // Si toutes les étapes principales sont complètes, afficher le résumé
        if (steps[ClientRegistrationStep.FUND_ORIGIN] === StepStatus.COMPLETE) {
          currentStep = ClientRegistrationStep.SUMMARY;
        } else {
          // Sinon, trouver la première étape non complète
          for (const step of STEP_ORDER) {
            if (steps[step] !== StepStatus.COMPLETE) {
              currentStep = step;
              break;
            }
          }
        }

        return {
          ...progress,
          steps,
          currentStep,
        };
      },

      // Fonction pour obtenir l'étape suivante (fonction pure)
      getNextStep: (currentStep, steps) => {
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        if (currentIndex < STEP_ORDER.length - 1) {
          const nextStep = STEP_ORDER[currentIndex + 1];

          // Vérifier si l'étape suivante est accessible
          if (steps[nextStep] !== StepStatus.LOCKED) {
            return nextStep;
          }
        }
        return null;
      },
    }),
    {
      name: 'client-file-storage',
      partialize: (state) => ({
        registrationProgress: state.registrationProgress,
        currentClientFile: state.currentClientFile,
      }),
    }
  )
);
