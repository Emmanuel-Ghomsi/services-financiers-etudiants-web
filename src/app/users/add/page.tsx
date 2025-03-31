"use client"

import type React from "react"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddUserPage() {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [telephone, setTelephone] = useState("")
  const [role, setRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validation simple
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    // Au lieu d'utiliser useRouter, utilisons window.location
    window.location.href = "/users"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader title="Utilisateurs" />
      <main className="flex-1 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Ajouter / modifier utilisateur</h2>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium">
                  Contact
                </label>
                <div className="flex">
                  <div className="flex items-center border rounded-l-md px-3 bg-white">
                    <span className="mr-1">🇺🇸</span>
                    <span>+1</span>
                  </div>
                  <Input
                    id="telephone"
                    type="tel"
                    placeholder="numéro de téléphone"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium">
                  Role
                </label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" asChild>
                <Link href="/users">Annuler</Link>
              </Button>
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
                Ajouter
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

