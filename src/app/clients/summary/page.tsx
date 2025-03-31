"use client"

import { AppHeader } from "@/components/layout/app-header"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SummaryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader title="Enregistrement client" />
      <div className="flex flex-1">
        <ClientSidebar />
        <main className="flex-1 p-6">
          <div className="form-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Récapitulatif des donnée du cient</h2>
              <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90">
                Exporter
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-md min-h-[400px] p-4">
              {/* Contenu du récapitulatif */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-medium">Informations personnelles</h3>
                  <p className="text-sm text-gray-600">Nom: Jean Dupont</p>
                  <p className="text-sm text-gray-600">Date de naissance: 15/05/1985</p>
                  <p className="text-sm text-gray-600">Nationalité: Française</p>
                </div>

                <div className="border-b pb-2">
                  <h3 className="font-medium">Coordonnées</h3>
                  <p className="text-sm text-gray-600">Adresse: 123 Rue de Paris, 75001 Paris</p>
                  <p className="text-sm text-gray-600">Email: jean.dupont@example.com</p>
                  <p className="text-sm text-gray-600">Téléphone: +33 6 12 34 56 78</p>
                </div>

                <div className="border-b pb-2">
                  <h3 className="font-medium">Profession</h3>
                  <p className="text-sm text-gray-600">Profession: Ingénieur</p>
                  <p className="text-sm text-gray-600">Secteur d'activité: Technologie</p>
                </div>

                <div className="border-b pb-2">
                  <h3 className="font-medium">Situation financière</h3>
                  <p className="text-sm text-gray-600">Revenus mensuels: 4500 €</p>
                  <p className="text-sm text-gray-600">Patrimoine: 250000 €</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/clients/registration/9">Modifier</Link>
              </Button>

              <Button className="bg-brand-green hover:bg-brand-green/90" asChild>
                <Link href="/clients">Enregistrer client</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

