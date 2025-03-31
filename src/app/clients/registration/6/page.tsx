"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { StepIndicator } from "@/components/ui/step-indicator"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"

export default function TransactionsPage() {
  const [steps, setSteps] = useState([
    { id: 1, label: "Motif", isActive: false, isCompleted: true },
    { id: 2, label: "Identité", isActive: false, isCompleted: true },
    { id: 3, label: "Coordonnées", isActive: false, isCompleted: true },
    { id: 4, label: "Profession", isActive: false, isCompleted: true },
    { id: 5, label: "Situation", isActive: false, isCompleted: true },
    { id: 6, label: "Transactions", isActive: true, isCompleted: false },
    { id: 7, label: "Produits et services", isActive: false, isCompleted: false },
    { id: 8, label: "Statut personne", isActive: false, isCompleted: false },
    { id: 9, label: "Classification", isActive: false, isCompleted: false },
  ])

  const handleNextStep = () => {
    window.location.href = "/clients/registration/7"
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
              <h2 className="text-lg font-bold text-brand-blue mb-4">TRANSACTIONS INTERNATIONALES</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Opérations internationales envisagées ou constatées
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="non-operations" />
                      <label htmlFor="non-operations">Non</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="oui-operations" />
                      <label htmlFor="oui-operations">Oui</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="pays" className="block text-sm font-medium">
                    Pays avec lesquels les transactions seront/sont affectées
                  </label>
                  <Select>
                    <SelectTrigger id="pays" className="w-full">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="usa">États-Unis</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">Royaume-Uni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="devises" className="block text-sm font-medium">
                      Devises avec lesquelles les transactions seront/sont effectuées
                    </label>
                    <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      <InfoIcon className="h-3 w-3" />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger id="devises" className="w-full">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">Euro (EUR)</SelectItem>
                      <SelectItem value="usd">Dollar américain (USD)</SelectItem>
                      <SelectItem value="gbp">Livre sterling (GBP)</SelectItem>
                      <SelectItem value="cad">Dollar canadien (CAD)</SelectItem>
                    </SelectContent>
                  </Select>
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

