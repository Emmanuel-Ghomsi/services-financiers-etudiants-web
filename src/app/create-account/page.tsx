"use client"

import type React from "react"

import { useState } from "react"
import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export default function CreateAccountPage() {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validation simple
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    window.location.href = "/verification"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-10">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium">
              Nom
            </label>
            <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>

          <div>
            <label htmlFor="prenom" className="block text-sm font-medium">
              Prénom
            </label>
            <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
          </div>

          <div>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirmation du Mot de passe
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90 mt-6">
            Créer
          </Button>

          <div className="my-4 flex items-center">
            <div className="flex-grow h-px bg-gray-200"></div>
            <div className="px-3 text-sm text-gray-500">ou</div>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M19.5 10.22C19.5 9.41 19.44 8.96 19.31 8.48H10V12.1H15.38C15.28 12.91 14.69 14.17 13.32 15.01L13.31 15.11L16.24 17.41L16.43 17.43C18.29 15.72 19.5 13.19 19.5 10.22Z"
                fill="#4285F4"
              />
              <path
                d="M10 20C12.7 20 14.96 19.1 16.43 17.43L13.32 15.01C12.5 15.58 11.37 15.99 10 15.99C7.38 15.99 5.19 14.28 4.4 11.9L4.31 11.9L1.26 14.29L1.22 14.39C2.67 17.74 6.06 20 10 20Z"
                fill="#34A853"
              />
              <path
                d="M4.4 11.9C4.18 11.42 4.05 10.89 4.05 10.34C4.05 9.79 4.18 9.26 4.39 8.78L4.38 8.67L1.29 6.24L1.22 6.29C0.45 7.79 0 9.5 0 11.34C0 13.18 0.45 14.89 1.22 16.39L4.4 11.9Z"
                fill="#FBBC05"
              />
              <path
                d="M10 4.69C11.85 4.69 13.11 5.45 13.81 6.09L16.58 3.38C14.95 1.86 12.7 0.85 10 0.85C6.06 0.85 2.67 3.11 1.22 6.46L4.39 8.78C5.19 6.4 7.38 4.69 10 4.69Z"
                fill="#EB4335"
              />
            </svg>
            Continuer avec Google
          </Button>
        </form>
      </div>
    </div>
  )
}

