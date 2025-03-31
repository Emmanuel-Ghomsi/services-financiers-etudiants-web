"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useToast } from "./use-toast"
import { useState } from "react"

export function useAuth() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast("Échec de la connexion. Vérifiez vos identifiants.", "error")
        return false
      }

      toast("Connexion réussie", "success")
      return true
    } catch (error) {
      console.error("Erreur de connexion:", error)
      toast("Une erreur est survenue lors de la connexion", "error")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: false })
      toast("Déconnexion réussie", "success")
      window.location.href = "/login"
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
      toast("Une erreur est survenue lors de la déconnexion", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    session,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || isLoading,
    login,
    logout,
  }
}

