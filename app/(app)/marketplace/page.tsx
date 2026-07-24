import Link from "next/link"

import { getGlobalSubjects } from "@/lib/data/curriculum"
import { getActiveListings } from "@/lib/data/marketplace"
import { getMyProviderProfile } from "@/lib/data/provider"
import { CreateListingForm } from "@/components/marketplace/create-listing-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { relation } from "@/lib/utils"

const CATEGORY_LABELS: Record<string, string> = {
  aula: "Aula",
  tutoria: "Tutoria",
  mentoria: "Mentoria",
  outro: "Outro",
}

export default async function MarketplacePage() {
  const [listings, subjects, providerProfile] = await Promise.all([
    getActiveListings(),
    getGlobalSubjects(),
    getMyProviderProfile(),
  ])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Professores, tutores e alunos oferecendo aulas e mentoria.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" render={<Link href="/marketplace/manage" />} nativeButton={false}>
            Minhas ofertas e pedidos
          </Button>
          {providerProfile ? (
            <CreateListingForm availableSubjects={subjects} />
          ) : (
            <Button size="sm" render={<Link href="/marketplace/provider-profile" />} nativeButton={false}>
              Tornar-se prestador
            </Button>
          )}
        </div>
      </div>

      {listings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum serviço disponível no momento.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/marketplace/${listing.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">{listing.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {relation(listing.profiles)?.full_name ?? "Anunciante"}
                  </p>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[listing.category] ?? listing.category}
                    </Badge>
                    <Badge variant="outline">{listing.modality}</Badge>
                    {relation(listing.subjects)?.name && (
                      <Badge variant="outline">
                        {relation(listing.subjects)?.name}
                      </Badge>
                    )}
                  </div>
                  {listing.price && (
                    <p className="text-sm font-medium">
                      R$ {Number(listing.price).toFixed(2)}{" "}
                      <span className="font-normal text-muted-foreground">
                        / {listing.price_unit}
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
