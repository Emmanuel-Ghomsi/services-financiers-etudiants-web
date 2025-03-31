"use client"

import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type Step = {
  id: number
  label: string
  isActive: boolean
  isCompleted: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  onStepClick?: (stepId: number) => void
}

export function StepIndicator({ steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center space-x-2 mb-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
              step.isCompleted
                ? "bg-brand-green text-white"
                : step.isActive
                  ? "bg-brand-blue text-white"
                  : "bg-gray-200 text-gray-500",
            )}
            onClick={() => onStepClick && onStepClick(step.id)}
          >
            {step.isCompleted ? <CheckIcon className="h-5 w-5" /> : <span>{step.id}</span>}
          </div>

          {index < steps.length - 1 && (
            <div className={cn("h-[2px] w-8", step.isCompleted ? "bg-brand-green" : "bg-gray-200")} />
          )}
        </div>
      ))}
    </div>
  )
}

