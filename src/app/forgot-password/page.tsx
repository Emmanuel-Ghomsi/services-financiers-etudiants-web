"use client"

import type React from "react"

import { useState } from "react"
import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler l'envoi d'un email de réinitialisation
    alert(`Un email de réinitialisation a été envoyé à ${email}`)
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-10">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Mot de passe oublié ?</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
            Réinitialiser
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button variant="link" asChild className="text-brand-blue hover:text-brand-blue/80">
            <Link href="/login">Retour à la connexion</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

