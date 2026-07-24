import Link from "next/link"

import {
  getBookingsReceived,
  getBookingsSent,
  getMyListings,
} from "@/lib/data/marketplace"
import { requireUser } from "@/lib/auth"
import { BookingStatusActions } from "@/components/marketplace/booking-status-actions"
import { ListingStatusActions } from "@/components/marketplace/listing-status-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { relation } from "@/lib/utils"

export default async function MarketplaceManagePage() {
  await requireUser()
  const [listings, sent, received] = await Promise.all([
    getMyListings(),
    getBookingsSent(),
    getBookingsReceived(),
  ])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Minhas ofertas e pedidos</h1>
        <Button variant="outline" size="sm" render={<Link href="/marketplace/provider-profile" />} nativeButton={false}>
          Meu perfil de prestador
        </Button>
      </div>

      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings">Meus anúncios</TabsTrigger>
          <TabsTrigger value="sent">Pedidos enviados</TabsTrigger>
          <TabsTrigger value="received">Pedidos recebidos</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="grid gap-3 pt-4">
          {listings.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Você ainda não publicou nenhum anúncio.
            </p>
          ) : (
            listings.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.category}
                      {listing.price &&
                        ` · R$ ${Number(listing.price).toFixed(2)} / ${listing.price_unit}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{listing.status}</Badge>
                    <ListingStatusActions
                      listingId={listing.id}
                      status={listing.status}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="grid gap-3 pt-4">
          {sent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Você ainda não solicitou nenhum serviço.
            </p>
          ) : (
            sent.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-medium">
                      {relation(booking.service_listings)?.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {relation(booking.students)?.full_name &&
                        `${relation(booking.students)?.full_name} · `}
                      {booking.preferred_date &&
                        new Date(booking.preferred_date).toLocaleDateString("pt-BR")}
                    </p>
                    {booking.message && (
                      <p className="text-sm text-muted-foreground">
                        &quot;{booking.message}&quot;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{booking.status}</Badge>
                    <BookingStatusActions
                      bookingId={booking.id}
                      status={booking.status}
                      role="requester"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="grid gap-3 pt-4">
          {received.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum pedido recebido ainda.
            </p>
          ) : (
            received.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-medium">
                      {relation(booking.service_listings)?.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {relation(booking.students)?.full_name &&
                        `${relation(booking.students)?.full_name} · `}
                      {booking.preferred_date &&
                        new Date(booking.preferred_date).toLocaleDateString("pt-BR")}
                    </p>
                    {booking.message && (
                      <p className="text-sm text-muted-foreground">
                        &quot;{booking.message}&quot;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{booking.status}</Badge>
                    <BookingStatusActions
                      bookingId={booking.id}
                      status={booking.status}
                      role="provider"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
