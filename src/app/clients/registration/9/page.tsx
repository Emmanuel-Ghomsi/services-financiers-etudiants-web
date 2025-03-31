"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { StepIndicator } from "@/components/ui/step-indicator"
import { Button } from "@/components/ui/button"

export default function ClassificationPage() {
  const [steps, setSteps] = useState([
    { id: 1, label: "Motif", isActive: false, isCompleted: true },
    { id: 2, label: "Identité", isActive: false, isCompleted: true },
    { id: 3, label: "Coordonnées", isActive: false, isCompleted: true },
    { id: 4, label: "Profession", isActive: false, isCompleted: true },
    { id: 5, label: "Situation", isActive: false, isCompleted: true },
    { id: 6, label: "Transactions", isActive: false, isCompleted: true },
    { id: 7, label: "Produits et services", isActive: false, isCompleted: true },
    { id: 8, label: "Statut personne", isActive: false, isCompleted: true },
    { id: 9, label: "Classification", isActive: true, isCompleted: false },
  ])

  const handleNextStep = () => {
    window.location.href = "/clients/summary"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader title="Enregistrement client" />
      <div className="flex flex-1">
        <ClientSidebar />
        <main className="flex-1 p-6">
          <div className="form-container">
            <StepIndicator
              steps={steps}
              onStepClick={(id) => {
                window.location.href = `/clients/registration/${id}`
              }}
            />

            <div className="mt-6">
              <h2 className="text-lg font-bold text-brand-blue mb-4">CLASSIFICATION LBC/FT CLIENT</h2>

              <div className="p-6 bg-gray-50 rounded-md">
                <p className="text-center text-gray-500">
                  Cette section sera automatiquement remplie en fonction des informations fournies dans les sections
                  précédentes.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleNextStep} className="bg-brand-green hover:bg-brand-green/90">
                Terminer
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

