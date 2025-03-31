"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AppHeader } from "@/components/layout/app-header"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { StepIndicator } from "@/components/ui/step-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ClientRegistrationStepPage() {
  const params = useParams()
  const currentStep = Number(params.step) || 1

  const [steps, setSteps] = useState([
    { id: 1, label: "Motif", isActive: false, isCompleted: false },
    { id: 2, label: "Identité", isActive: false, isCompleted: false },
    { id: 3, label: "Coordonnées", isActive: false, isCompleted: false },
    { id: 4, label: "Profession", isActive: false, isCompleted: false },
    { id: 5, label: "Situation", isActive: false, isCompleted: false },
    { id: 6, label: "Transactions", isActive: false, isCompleted: false },
    { id: 7, label: "Produits et services", isActive: false, isCompleted: false },
    { id: 8, label: "Statut personne", isActive: false, isCompleted: false },
    { id: 9, label: "Classification", isActive: false, isCompleted: false },
  ])

  // Met à jour les étapes actives
  useEffect(() => {
    const updatedSteps = steps.map((step) => ({
      ...step,
      isActive: step.id === currentStep,
      isCompleted: step.id < currentStep,
    }))
    setSteps(updatedSteps)
  }, [currentStep])

  const handleNextStep = () => {
    const nextStep = currentStep + 1
    if (nextStep <= steps.length) {
      window.location.href = `/clients/registration/${nextStep}`
    } else {
      window.location.href = "/clients"
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <MotifStep />
      case 2:
        return <IdentiteStep />
      case 3:
        return <CoordonneesStep />
      case 4:
        return <ProfessionStep />
      case 5:
        return <SituationStep />
      default:
        return <div>Étape en construction...</div>
    }
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
            {renderStepContent()}
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

function MotifStep() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Quel est le motif de cet enregistrement ?</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="entree" />
          <label
            htmlFor="entree"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Entrée en relation
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="revue" />
          <label
            htmlFor="revue"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Revue périodique
          </label>
        </div>
      </div>

      <h2 className="text-lg font-medium pt-4">Type de client</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="titulaire" />
          <label
            htmlFor="titulaire"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Titulaire
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="mandataire" />
          <label
            htmlFor="mandataire"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mandataire
          </label>
        </div>
      </div>

      <h2 className="text-lg font-medium pt-4">Ouverture du compte à un non-Résident</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="non" />
          <label
            htmlFor="non"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Non
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="oui" />
          <label
            htmlFor="oui"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Oui
          </label>
        </div>
      </div>
    </div>
  )
}

function IdentiteStep() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium">
            Nom du client
          </label>
          <Input id="nom" />
        </div>
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium">
            Prénoms du client
          </label>
          <Input id="prenom" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nomJeuneFille" className="block text-sm font-medium">
            Nom de jeune fille
          </label>
          <Input id="nomJeuneFille" />
        </div>
        <div>
          <label htmlFor="dateNaissance" className="block text-sm font-medium">
            Date de naissance
          </label>
          <div className="relative">
            <Input id="dateNaissance" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="lieuNaissance" className="block text-sm font-medium">
            Lieu de naissance (ville)
          </label>
          <Input id="lieuNaissance" />
        </div>
        <div>
          <label htmlFor="paysNaissance" className="block text-sm font-medium">
            Lieu de naissance (pays)
          </label>
          <Select>
            <SelectTrigger id="paysNaissance">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="belgique">Belgique</SelectItem>
              <SelectItem value="suisse">Suisse</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="typePiece" className="block text-sm font-medium">
            Type de pièce d'identité
          </label>
          <Select>
            <SelectTrigger id="typePiece">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cni">Carte Nationale d'Identité</SelectItem>
              <SelectItem value="passeport">Passeport</SelectItem>
              <SelectItem value="permis">Permis de conduire</SelectItem>
              <SelectItem value="titre">Titre de séjour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="numeroPiece" className="block text-sm font-medium">
            Numéro de pièce d'identité
          </label>
          <Input id="numeroPiece" />
        </div>
      </div>

      <div>
        <label htmlFor="nationalite" className="block text-sm font-medium">
          Nationalité (y compris double nationalité)
        </label>
        <Input id="nationalite" />
      </div>

      <div>
        <label htmlFor="representant" className="block text-sm font-medium">
          Nom et qualité de représentant légal (si applicable)
        </label>
        <Input id="representant" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Détenteur d'un compte bancaire</label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="nonCompte" />
            <label htmlFor="nonCompte">Non</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ouiCompte" />
            <label htmlFor="ouiCompte">Oui</label>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="fiscal" className="block text-sm font-medium">
          N° d'immatriculation fiscal Unique / Pays d'immatriculation
        </label>
        <Input id="fiscal" />
      </div>
    </div>
  )
}

function CoordonneesStep() {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="adresseDomicile" className="block text-sm font-medium">
          Adresse de domicile
        </label>
        <Input id="adresseDomicile" />
      </div>

      <div>
        <label htmlFor="adressePostale" className="block text-sm font-medium">
          Adresse postale
        </label>
        <Input id="adressePostale" />
      </div>

      <div>
        <label htmlFor="paysFiscal" className="block text-sm font-medium">
          Pays de résidence fiscale
        </label>
        <Input id="paysFiscal" />
      </div>

      <div>
        <label htmlFor="telephone" className="block text-sm font-medium">
          Contact(s) téléphonique(s)
        </label>
        <div className="flex">
          <div className="flex items-center border rounded-l-md px-3 bg-white">
            <span className="mr-1">🇺🇸</span>
            <span>+1</span>
          </div>
          <Input id="telephone" placeholder="numéro de téléphone" className="rounded-l-none" />
          <Button variant="ghost" className="ml-2 p-2">
            <div className="rounded-full bg-gray-200 p-1">
              <span className="text-lg">+</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProfessionStep() {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="profession" className="block text-sm font-medium">
          Profession
        </label>
        <Input id="profession" />
      </div>

      <div>
        <label htmlFor="secteur" className="block text-sm font-medium">
          Secteur d'activité
        </label>
        <Input id="secteur" />
      </div>

      <div>
        <label htmlFor="dateDebutActivite" className="block text-sm font-medium">
          Date de début d'activité (pour les professionnels)
        </label>
        <div className="relative">
          <Input id="dateDebutActivite" />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="perimetre" className="block text-sm font-medium">
          Périmètre géographique d'activité du client
        </label>
        <div className="relative">
          <Input id="perimetre" />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SituationStep() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Origines des ressources</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="salaire" />
            <label htmlFor="salaire">salaire</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="pension" />
            <label htmlFor="pension">pension</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="retraite" />
            <label htmlFor="retraite">retraite</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="autre" />
            <label htmlFor="autre">autre</label>
            <Input className="w-36" />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="montants" className="block text-sm font-medium">
            Montants des revenus mensuels
          </label>
          <Input id="montants" />
        </div>
        <div className="w-24">
          <label htmlFor="devise" className="block text-sm font-medium">
            &nbsp;
          </label>
          <Select>
            <SelectTrigger id="devise">
              <SelectValue placeholder="€" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="provenance" className="block text-sm font-medium">
          Provenance et destinations des fonds
        </label>
        <Textarea id="provenance" rows={3} />
      </div>

      <div className="flex space-x-2">
        <div className="flex-1">
          <label htmlFor="patrimoine" className="block text-sm font-medium">
            Patrimoine
          </label>
          <div className="relative">
            <Input id="patrimoine" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

