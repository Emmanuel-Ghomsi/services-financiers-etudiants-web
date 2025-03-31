"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileIcon,
  MessageSquareIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClientsListPage() {
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  const clients = [
    { id: "1", nom: "Darlene Robertson", email: "darlene@example.com", date: "12/03/2023", status: "En attente" },
    { id: "2", nom: "Guy Hawkins", email: "guy@example.com", date: "15/03/2023", status: "En attente" },
    { id: "3", nom: "Esther Howard", email: "esther@example.com", date: "18/03/2023", status: "En attente" },
    { id: "4", nom: "Wade Warren", email: "wade@example.com", date: "20/03/2023", status: "Actif" },
    { id: "5", nom: "Devon Lane", email: "devon@example.com", date: "22/03/2023", status: "Actif" },
    { id: "6", nom: "Kathryn Murphy", email: "kathryn@example.com", date: "25/03/2023", status: "Actif" },
    { id: "7", nom: "Cameron Williamson", email: "cameron@example.com", date: "28/03/2023", status: "Actif" },
    { id: "8", nom: "Floyd Miles", email: "floyd@example.com", date: "01/04/2023", status: "Suspendu" },
    { id: "9", nom: "Ronald Richards", email: "ronald@example.com", date: "03/04/2023", status: "En attente" },
    { id: "10", nom: "Annette Black", email: "annette@example.com", date: "05/04/2023", status: "En attente" },
    { id: "11", nom: "Dianne Russell", email: "dianne@example.com", date: "08/04/2023", status: "Actif" },
    { id: "12", nom: "Theresa Webb", email: "theresa@example.com", date: "10/04/2023", status: "Actif" },
  ]

  const toggleSelectClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter((id) => id !== clientId))
    } else {
      setSelectedClients([...selectedClients, clientId])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "text-green-600"
      case "En attente":
        return "text-gray-500"
      case "Suspendu":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader title="Clients" />
      <div className="flex flex-col p-6">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90" asChild>
              <Link href="/clients">Clients enregistrés</Link>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <Button variant="outline" className="flex items-center space-x-2" asChild>
            <Link href="/clients/new">
              <span className="text-lg">+</span>
              <span>Ajouter un client</span>
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Input placeholder="Rechercher un client" className="pl-10 w-80" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">afficher</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-16">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">Par page</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Input placeholder="Date" className="w-40 pr-10" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button variant="outline" className="text-sm">
                Filtre
              </Button>
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-sm">Exporter</Button>
              <Button variant="destructive" className="text-sm">
                Supprimer
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 whitespace-nowrap">Nom & prénom</th>
                  <th className="p-4 whitespace-nowrap">Email</th>
                  <th className="p-4 whitespace-nowrap">Date d'inscription</th>
                  <th className="p-4 whitespace-nowrap">Informations détaillées</th>
                  <th className="p-4 whitespace-nowrap">Sélectionner</th>
                  <th className="p-4 whitespace-nowrap">Éditer</th>
                  <th className="p-4 whitespace-nowrap">Message</th>
                  <th className="p-4 whitespace-nowrap">État</th>
                  <th className="p-4 whitespace-nowrap">Supprimer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="p-4 whitespace-nowrap">{client.nom}</td>
                    <td className="p-4 whitespace-nowrap">{client.email}</td>
                    <td className="p-4 whitespace-nowrap">{client.date}</td>
                    <td className="p-4 whitespace-nowrap">
                      <Button variant="link" className="text-brand-blue p-0 h-auto">
                        Voir fichier
                      </Button>
                      <FileIcon className="inline-block ml-1 h-4 w-4 text-gray-400" />
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Checkbox />
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquareIcon className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={getStatusColor(client.status)}>{client.status}</span>
                      <ChevronRightIcon className="inline-block ml-1 h-4 w-4 text-gray-400" />
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-center border-t">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Précédent</span>
              </Button>
              <Button variant="outline" size="sm">
                04
              </Button>
              <Button variant="outline" size="sm">
                05
              </Button>
              <Button variant="default" size="sm" className="bg-brand-blue hover:bg-brand-blue/90">
                06
              </Button>
              <Button variant="outline" size="sm">
                08
              </Button>
              <Button variant="outline" size="sm">
                09
              </Button>
              <Button variant="outline" size="sm">
                10
              </Button>
              <Button variant="outline" size="sm">
                11
              </Button>
              <Button variant="outline" size="sm">
                12
              </Button>
              <Button variant="outline" size="sm">
                13
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Suivant</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

