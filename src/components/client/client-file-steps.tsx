'use client';

import { Check, CircleDashed, CircleDot, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientRegistrationStep, StepStatus } from '@/types/client-file';

interface ClientFileStepsProps {
  currentStep: ClientRegistrationStep;
  steps: Record<ClientRegistrationStep, StepStatus>;
  onStepClick?: (step: ClientRegistrationStep) => void;
}

interface StepInfo {
  id: ClientRegistrationStep;
  label: string;
}

// Définition des étapes avec leurs libellés
const STEPS: StepInfo[] = [
  { id: ClientRegistrationStep.BASIC_INFO, label: 'Motif' },
  { id: ClientRegistrationStep.IDENTITY, label: 'Identité' },
  { id: ClientRegistrationStep.CONTACT, label: 'Coordonnées' },
  { id: ClientRegistrationStep.PROFESSION, label: 'Profession' },
  { id: ClientRegistrationStep.FINANCIAL_SITUATION, label: 'Situation' },
  { id: ClientRegistrationStep.TRANSACTIONS, label: 'Transactions' },
  { id: ClientRegistrationStep.SERVICES, label: 'Produits et services offerts au client' },
  { id: ClientRegistrationStep.PEP_STATUS, label: 'Statut personne' },
  { id: ClientRegistrationStep.LBC_FT_CLASSIFICATION, label: 'Classification LBC/FT client' },
];

export function ClientFileSteps({ currentStep, steps, onStepClick }: ClientFileStepsProps) {
  return (
    <div className="flex items-center justify-between w-full overflow-x-auto pb-4">
      {STEPS.map((step, index) => {
        const stepStatus = steps[step.id];
        const isActive = currentStep === step.id;

        // Déterminer l'état pour le style et l'icône
        const isCompleted = stepStatus === StepStatus.COMPLETE;
        const isLocked = stepStatus === StepStatus.LOCKED;
        const isClickable = !isLocked && stepStatus !== StepStatus.NOT_STARTED;

        return (
          <div key={step.id} className="flex items-center flex-none">
            {/* Étape */}
            <button
              type="button"
              disabled={isLocked}
              onClick={() => isClickable && onStepClick?.(step.id)}
              className={cn(
                'flex items-center justify-center h-8 w-8 rounded-full transition-colors mr-2',
                isActive && 'bg-brand-blue text-white',
                isCompleted && !isActive && 'bg-green-500 text-white',
                isLocked && 'bg-gray-200 text-gray-400 cursor-not-allowed',
                !isActive &&
                  !isCompleted &&
                  !isLocked &&
                  'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : isLocked ? (
                <Lock className="h-4 w-4" />
              ) : isActive ? (
                <CircleDot className="h-4 w-4" />
              ) : (
                <CircleDashed className="h-4 w-4" />
              )}
            </button>

            {/* Libellé de l'étape */}
            <span
              className={cn(
                'text-sm font-medium whitespace-nowrap',
                isActive ? 'text-brand-blue' : 'text-gray-600',
                isLocked && 'text-gray-400'
              )}
            >
              {step.label}
            </span>

            {/* Connecteur entre les étapes */}
            {index < STEPS.length - 1 && (
              <div className={cn('h-0.5 w-6 mx-1', isCompleted ? 'bg-green-500' : 'bg-gray-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
