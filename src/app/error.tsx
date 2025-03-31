"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionnel: Log l'erreur sur un service d'analytics
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-blue">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Une erreur est survenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center">
            Nous sommes désolés, une erreur inattendue s'est produite. Veuillez réessayer ou contacter le support si le
            problème persiste.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default" className="bg-brand-blue hover:bg-brand-blue/90">
            Réessayer
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

