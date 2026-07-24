import { redirect } from "next/navigation"
import { FileText, Link as LinkIcon } from "lucide-react"

import { getUserFamilies } from "@/lib/auth"
import { getAvailableSubjects } from "@/lib/data/curriculum"
import { getMaterialFileUrl, getMaterialsByStudent } from "@/lib/data/materials"
import { getTermsForStudent } from "@/lib/data/planning"
import { CreateMaterialForm } from "@/components/materials/create-material-form"
import { DeleteMaterialButton } from "@/components/materials/delete-material-button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { relation } from "@/lib/utils"

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const families = await getUserFamilies()
  const family = families[0]

  if (!family) {
    redirect("/onboarding/family")
  }

  const [materials, availableSubjects, terms] = await Promise.all([
    getMaterialsByStudent(studentId),
    getAvailableSubjects(family.id),
    getTermsForStudent(studentId),
  ])

  const materialsWithUrls = await Promise.all(
    materials.map(async (material) => ({
      ...material,
      fileUrl: material.storage_path
        ? await getMaterialFileUrl(material.storage_path)
        : null,
    }))
  )

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Novo material</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateMaterialForm
            studentId={studentId}
            availableSubjects={availableSubjects}
            terms={terms}
          />
        </CardContent>
      </Card>

      {materialsWithUrls.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum material cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-3">
          {materialsWithUrls.map((material) => (
            <Card key={material.id}>
              <CardContent className="flex items-start justify-between gap-3 py-4">
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{material.title}</span>
                    <Badge variant="secondary">{material.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {relation(material.subjects)?.name}
                  </p>
                  {material.notes && (
                    <p className="text-sm text-muted-foreground">
                      {material.notes}
                    </p>
                  )}
                  <div className="flex gap-3 text-sm">
                    {material.url && (
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                      >
                        <LinkIcon className="size-3.5" />
                        Abrir link
                      </a>
                    )}
                    {material.fileUrl && (
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                      >
                        <FileText className="size-3.5" />
                        Abrir arquivo
                      </a>
                    )}
                  </div>
                </div>
                <DeleteMaterialButton
                  studentId={studentId}
                  materialId={material.id}
                  storagePath={material.storage_path}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
