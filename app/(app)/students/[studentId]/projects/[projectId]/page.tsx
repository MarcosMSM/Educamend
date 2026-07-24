import { notFound } from "next/navigation"
import { FileIcon } from "lucide-react"

import {
  getAttachmentUrl,
  getProjectAttachments,
  getProjectById,
} from "@/lib/data/projects"
import { AttachmentUploadForm } from "@/components/projects/attachment-upload-form"
import { DeleteAttachmentButton } from "@/components/projects/delete-attachment-button"
import { DeleteProjectButton } from "@/components/projects/delete-project-button"
import { UpdateProjectStatusForm } from "@/components/projects/update-project-status-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { relation } from "@/lib/utils"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ studentId: string; projectId: string }>
}) {
  const { studentId, projectId } = await params
  const project = await getProjectById(projectId)

  if (!project) {
    notFound()
  }

  const attachments = await getProjectAttachments(projectId)
  const attachmentsWithUrls = await Promise.all(
    attachments.map(async (attachment) => ({
      ...attachment,
      url: await getAttachmentUrl(attachment.storage_path),
    }))
  )

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-lg font-semibold">{project.title}</h2>
        {relation(project.subjects)?.name && (
          <p className="text-sm text-muted-foreground">
            {relation(project.subjects)?.name}
          </p>
        )}
      </div>

      {project.description && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateProjectStatusForm
            studentId={studentId}
            projectId={project.id}
            status={project.status}
            visibility={project.visibility}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Anexos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {attachmentsWithUrls.length > 0 && (
            <ul className="grid gap-2">
              {attachmentsWithUrls.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  {attachment.url ? (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary underline-offset-4 hover:underline"
                    >
                      <FileIcon className="size-3.5" />
                      {attachment.file_name}
                    </a>
                  ) : (
                    <span>{attachment.file_name}</span>
                  )}
                  <DeleteAttachmentButton
                    studentId={studentId}
                    projectId={project.id}
                    attachmentId={attachment.id}
                    storagePath={attachment.storage_path}
                  />
                </li>
              ))}
            </ul>
          )}
          <AttachmentUploadForm studentId={studentId} projectId={project.id} />
        </CardContent>
      </Card>

      <div>
        <DeleteProjectButton
          studentId={studentId}
          projectId={project.id}
          projectTitle={project.title}
        />
      </div>
    </div>
  )
}
