import { notFound } from "next/navigation"

import { requireUser } from "@/lib/auth"
import { getListingById } from "@/lib/data/marketplace"
import { getStudents } from "@/lib/data/students"
import { CreateBookingForm } from "@/components/marketplace/create-booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { relation } from "@/lib/utils"

const CATEGORY_LABELS: Record<string, string> = {
  aula: "Aula",
  tutoria: "Tutoria",
  mentoria: "Mentoria",
  outro: "Outro",
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const { listingId } = await params
  const listing = await getListingById(listingId)

  if (!listing) {
    notFound()
  }

  const user = await requireUser()
  const isOwner = listing.provider_profile_id === user.id
  const students = isOwner ? [] : await getStudents().catch(() => [])

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="sm:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{listing.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {relation(listing.profiles)?.full_name ?? "Anunciante"}
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {CATEGORY_LABELS[listing.category] ?? listing.category}
              </Badge>
              <Badge variant="outline">{listing.modality}</Badge>
              {relation(listing.subjects)?.name && (
                <Badge variant="outline">{relation(listing.subjects)?.name}</Badge>
              )}
            </div>
            {listing.price && (
              <p className="font-medium">
                R$ {Number(listing.price).toFixed(2)}{" "}
                <span className="font-normal text-muted-foreground">
                  / {listing.price_unit}
                </span>
              </p>
            )}
            {listing.description && (
              <p className="text-sm text-muted-foreground">
                {listing.description}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        {isOwner ? (
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Este é o seu anúncio. Gerencie o status dele em{" "}
              <span className="font-medium text-foreground">
                Minhas ofertas e pedidos
              </span>
              .
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Solicitar</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateBookingForm listingId={listing.id} students={students} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
