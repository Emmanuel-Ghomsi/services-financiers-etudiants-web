"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { StepIndicator } from "@/components/ui/step-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, MapPinIcon } from "lucide-react"

export default function StatutPersonnePage() {
  const [steps, setSteps] = useState([
    { id: 1, label: "Motif", isActive: false, isCompleted: true },
    { id: 2, label: "Identité", isActive: false, isCompleted: true },
    { id: 3, label: "Coordonnées", isActive: false, isCompleted: true },
    { id: 4, label: "Profession", isActive: false, isCompleted: true },
    { id: 5, label: "Situation", isActive: false, isCompleted: true },
    { id: 6, label: "Transactions", isActive: false, isCompleted: true },
    { id: 7, label: "Produits et services", isActive: false, isCompleted: true },
    { id: 8, label: "Statut personne", isActive: true, isCompleted: false },
    { id: 9, label: "Classification", isActive: false, isCompleted: false },
  ])

  const handleNextStep = () => {
    window.location.href = "/clients/registration/9"
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
              <h2 className="text-lg font-bold text-brand-blue mb-4">STATUT PERSONNE POLITIQUEMENT EXPOSÉE PPE</h2>
              <p className="text-sm text-gray-500 mb-4">(Si oui, compléter les champs suivants)</p>

              <div className="space-y-2 mb-4">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="non-ppe" />
                    <label htmlFor="non-ppe">Non</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="oui-ppe" />
                    <label htmlFor="oui-ppe">Oui</label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Le statut de PPE émane-t-il de la liste de fonctions publiques importantes ou de la liste des
                    proches PPE
                  </label>
                  <div className="flex space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fonctions-publiques" />
                      <label htmlFor="fonctions-publiques">Fonctions publiques importantes(1)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="proches-ppe" />
                      <label htmlFor="proches-ppe">proches PPE(2)</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="mandat" className="block text-sm font-medium">
                    (1) Si c'est Fonctions publiques importantes » précisez le mandat PPE :
                  </label>
                  <Input id="mandat" className="mt-1" />
                </div>

                <div>
                  <label htmlFor="date-fin" className="block text-sm font-medium">
                    Date de fin du statut PPE
                  </label>
                  <div className="relative mt-1">
                    <Input id="date-fin" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="lien" className="block text-sm font-medium">
                    (2) Si c'est proches PPE » précisez le type de lien (cercle familial ou cercle d'influence)
                  </label>
                  <Input id="lien" className="mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom-ppe" className="block text-sm font-medium">
                      Nom du PPE
                    </label>
                    <Input id="nom-ppe" className="mt-1" />
                  </div>
                  <div>
                    <label htmlFor="prenom-ppe" className="block text-sm font-medium">
                      Prénom du PPE
                    </label>
                    <Input id="prenom-ppe" className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date-naissance-ppe" className="block text-sm font-medium">
                      Date de naissance du PPE
                    </label>
                    <div className="relative mt-1">
                      <Input id="date-naissance-ppe" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lieu-naissance-ppe" className="block text-sm font-medium">
                      Lieu de naissance du PPE
                    </label>
                    <div className="relative mt-1">
                      <Input id="lieu-naissance-ppe" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
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

