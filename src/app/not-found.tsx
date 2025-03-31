import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/layout/logo"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-blue">
      <Logo />
      <Card className="max-w-md w-full mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-9xl font-bold text-brand-blue">404</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
          <p className="text-gray-600">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

