import { useMutation, useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/stores/auth-store"
import type { LoginFormValues, RegisterFormValues } from "@/lib/validators/auth"

// Fonction pour simuler un appel API de connexion
async function loginApi(data: LoginFormValues) {
  // Ici, vous feriez un vrai appel API
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Échec de la connexion")
  }

  return response.json()
}

// Fonction pour simuler un appel API d'inscription
async function registerApi(data: RegisterFormValues) {
  // Ici, vous feriez un vrai appel API
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Échec de l'inscription")
  }

  return response.json()
}

// Hook pour la connexion
export function useLogin() {
  const { setUser, setToken } = useAuthStore()

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setUser(data.user)
      setToken(data.token)
    },
  })
}

// Hook pour l'inscription
export function useRegister() {
  return useMutation({
    mutationFn: registerApi,
  })
}

// Hook pour récupérer le profil utilisateur
export function useUserProfile() {
  const { token, user } = useAuthStore()

  return useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      if (!token) throw new Error("Non authentifié")

      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Échec de la récupération du profil")
      }

      return response.json()
    },
    enabled: !!token && !!user,
  })
}

