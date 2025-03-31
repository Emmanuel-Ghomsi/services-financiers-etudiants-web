"use client"

import { CheckIcon } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { useEffect } from "react"

export default function ConnectedPage() {
  useEffect(() => {
    // Rediriger vers la page des clients après 2 secondes
    const timer = setTimeout(() => {
      window.location.href = "/clients"
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="mb-10">
        <Logo />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mb-6">
          <CheckIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Vous êtes connectés</h1>
      </div>
    </div>
  )
}

