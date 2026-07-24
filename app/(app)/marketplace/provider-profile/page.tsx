import { getMyProviderProfile } from "@/lib/data/provider"
import { ProviderProfileForm } from "@/components/marketplace/provider-profile-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function ProviderProfilePage() {
  const providerProfile = await getMyProviderProfile()

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de prestador de serviços</CardTitle>
          <CardDescription>
            {providerProfile
              ? "Atualize suas informações públicas de prestador."
              : "Ative seu perfil de prestador para poder publicar anúncios no marketplace."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderProfileForm
            headline={providerProfile?.headline ?? null}
            bio={providerProfile?.bio ?? null}
            formation={providerProfile?.formation ?? null}
            experienceYears={providerProfile?.experience_years ?? null}
          />
        </CardContent>
      </Card>
    </div>
  )
}
