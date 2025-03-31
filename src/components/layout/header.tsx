import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Service Financier
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Tableau de bord
            </Link>
            <Link href="/clients" className="text-sm font-medium transition-colors hover:text-primary">
              Clients
            </Link>
            <Link href="/users" className="text-sm font-medium transition-colors hover:text-primary">
              Utilisateurs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

