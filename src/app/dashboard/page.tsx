import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/format"

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <CardDescription>Mois en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(45231.89)}</div>
            <p className="text-xs text-muted-foreground">+20.1% par rapport au mois précédent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
            <CardDescription>Mois en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CardDescription>Mois en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,450</div>
            <p className="text-xs text-muted-foreground">+180 depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <CardDescription>Mois en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">+2.3% par rapport au mois précédent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

