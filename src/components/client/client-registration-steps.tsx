"use client"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RegistrationStep {
  id: number
  label: string
  isCompleted: boolean
  isActive: boolean
}

interface ClientRegistrationStepsProps {
  steps: RegistrationStep[]
  onStepClick: (stepId: number) => void
  showProgress?: boolean
}

export function ClientRegistrationSteps({ steps, onStepClick, showProgress = false }: ClientRegistrationStepsProps) {
  return (
    <div className="w-full space-y-1">
      {showProgress && (
        <div className="flex items-center justify-between mb-2 text-sm">
          <span>Suivi d'enregistrement client</span>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs">
              !
            </span>
            <span className="text-gray-400">incomplet</span>
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-brand-green text-white text-xs">
              <CheckIcon className="w-3 h-3" />
            </span>
            <span className="text-brand-green">complet</span>
          </div>
        </div>
      )}
      {steps.map((step) => (
        <div
          key={step.id}
          className={cn(
            "step-item flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer rounded-md hover:bg-gray-50",
            step.isCompleted ? "bg-green-50" : step.isActive ? "bg-blue-50" : "",
          )}
          onClick={() => onStepClick(step.id)}
        >
          <div className="flex items-center">
            <div
              className={cn(
                "step-circle w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3",
                step.isCompleted
                  ? "bg-brand-green text-white"
                  : step.isActive
                    ? "bg-brand-blue text-white"
                    : "bg-gray-200 text-gray-500",
              )}
            >
              {step.isCompleted ? <CheckIcon className="w-4 h-4" /> : step.id}
            </div>
            <span className="text-sm">{step.label}</span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div>
      ))}
    </div>
  )
}

