"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { StepIndicator } from "@/components/ui/step-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"

export default function ProduitsServicesPage() {
  const [steps, setSteps] = useState([
    { id: 1, label: "Motif", isActive: false, isCompleted: true },
    { id: 2, label: "Identité", isActive: false, isCompleted: true },
    { id: 3, label: "Coordonnées", isActive: false, isCompleted: true },
    { id: 4, label: "Profession", isActive: false, isCompleted: true },
    { id: 5, label: "Situation", isActive: false, isCompleted: true },
    { id: 6, label: "Transactions", isActive: false, isCompleted: true },
    { id: 7, label: "Produits et services", isActive: true, isCompleted: false },
    { id: 8, label: "Statut personne", isActive: false, isCompleted: false },
    { id: 9, label: "Classification", isActive: false, isCompleted: false },
  ])

  const handleNextStep = () => {
    window.location.href = "/clients/registration/8"
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
              <h2 className="text-lg font-bold text-brand-blue mb-4">PRODUITS ET SERVICES OFFERTS AU CLIENTS</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="comptes" className="block text-sm font-medium">
                    Comptes de paiement
                  </label>
                  <Input id="comptes" />
                </div>

                <h3 className="text-md font-semibold text-brand-blue mt-6">FONCTIONNEMENT DES COMPTES</h3>

                <div className="space-y-2">
                  <label htmlFor="fonctionnement" className="block text-sm font-medium">
                    Fonctionnement attendu ou constaté du compte (Types d'opérations)
                  </label>
                  <Select>
                    <SelectTrigger id="fonctionnement" className="w-full">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="courant">Compte courant standard</SelectItem>
                      <SelectItem value="epargne">Compte d'épargne</SelectItem>
                      <SelectItem value="professionnel">Compte professionnel</SelectItem>
                      <SelectItem value="joint">Compte joint</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end">
                    <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      <InfoIcon className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                <h3 className="text-md font-medium mt-4">
                  Montant des opérations envisagées ou constatées (revue périodique)
                </h3>

                <div className="space-y-2">
                  <label htmlFor="credit" className="block text-sm font-medium">
                    Au crédit : (salaire, pension, loyer reçu etc.)
                  </label>
                  <Input id="credit" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="debit" className="block text-sm font-medium">
                    Au débit : (charges récurrentes, dépenses courantes etc.)
                  </label>
                  <Input id="debit" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleNextStep} className="bg-brand-green hover:bg-brand-green/90">
                Suivant
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

