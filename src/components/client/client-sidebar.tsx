import Link from "next/link"
import { Button } from "../ui/button"

export function ClientSidebar() {
  return (
    <div className="w-48 flex flex-col space-y-4 py-4">
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <Link href="/clients">
          <div className="px-4 py-2 bg-white hover:bg-gray-50 text-sm font-medium">Clients enregistrés</div>
        </Link>
      </div>
      <Button variant="link" className="text-brand-blue text-sm font-medium hover:text-brand-blue/80" asChild>
        <Link href="/clients/new">Ajouter un client</Link>
      </Button>
    </div>
  )
}

