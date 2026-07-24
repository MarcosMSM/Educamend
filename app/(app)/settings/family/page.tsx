import { redirect } from "next/navigation"

import { getUserFamilies } from "@/lib/auth"
import { getFamilyMembers } from "@/lib/data/families"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditFamilyCityForm } from "@/components/families/edit-family-city-form"
import { relation } from "@/lib/utils"

export default async function FamilySettingsPage() {
  const families = await getUserFamilies()

  if (families.length === 0) {
    redirect("/onboarding/family")
  }

  const family = families[0]
  const members = await getFamilyMembers(family.id)

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{family.name}</h1>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{family.city || "Cidade não informada"}</span>
          <EditFamilyCityForm familyId={family.id} city={family.city} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Membros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {members.map((member) => (
            <div
              key={member.profile_id}
              className="flex items-center justify-between text-sm"
            >
              <span>{relation(member.profiles)?.full_name ?? "Sem nome"}</span>
              <div className="flex gap-2">
                <Badge variant="secondary">{member.relationship}</Badge>
                {member.is_admin && <Badge>admin</Badge>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
