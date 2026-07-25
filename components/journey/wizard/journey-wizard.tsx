"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { createJourneyDraft } from "@/actions/journey"
import { useJourneyAutosave } from "@/hooks/use-journey-autosave"
import type { JourneyExperience } from "@/lib/data/journey"
import type {
  AutosaveJourneyExperienceInput,
  JourneyAttachmentInput,
  JourneyCategory,
  JourneySkill,
} from "@/lib/validation/journey"

import { Step1Category } from "@/components/journey/wizard/step-1-category"
import { Step2BasicInfo } from "@/components/journey/wizard/step-2-basic-info"
import { Step3StoryReflection } from "@/components/journey/wizard/step-3-story-reflection"
import { Step4Skills } from "@/components/journey/wizard/step-4-skills"
import { Step5Evidence } from "@/components/journey/wizard/step-5-evidence"
import { Step6Review } from "@/components/journey/wizard/step-6-review"
import { Step7Confirmation } from "@/components/journey/wizard/step-7-confirmation"
import { WizardStepIndicator } from "@/components/journey/wizard/wizard-step-indicator"

export type JourneyDraftFields = {
  title: string
  organization: string
  startDate: string
  endDate: string
  hours: string
  description: string
  reflection: string
  skills: JourneySkill[]
  attachments: JourneyAttachmentInput[]
}

type TextField = "title" | "organization" | "startDate" | "endDate" | "hours"
type LongTextField = "description" | "reflection"

function toDraftFields(experience: JourneyExperience | null): JourneyDraftFields {
  return {
    title: experience?.title ?? "",
    organization: experience?.organization ?? "",
    startDate: experience?.start_date ?? "",
    endDate: experience?.end_date ?? "",
    hours: experience?.hours != null ? String(experience.hours) : "",
    description: experience?.description ?? "",
    reflection: experience?.reflection ?? "",
    skills: experience?.skills ?? [],
    attachments: experience?.attachments ?? [],
  }
}

function toAutosavePayload(
  patch: Partial<JourneyDraftFields>
): AutosaveJourneyExperienceInput {
  const payload: AutosaveJourneyExperienceInput = {}
  if (patch.title !== undefined) payload.title = patch.title
  if (patch.organization !== undefined) payload.organization = patch.organization
  if (patch.startDate !== undefined) payload.startDate = patch.startDate
  if (patch.endDate !== undefined) payload.endDate = patch.endDate
  if (patch.hours !== undefined) {
    payload.hours = patch.hours === "" ? undefined : Number(patch.hours)
  }
  if (patch.description !== undefined) payload.description = patch.description
  if (patch.reflection !== undefined) payload.reflection = patch.reflection
  if (patch.skills !== undefined) payload.skills = patch.skills
  if (patch.attachments !== undefined) payload.attachments = patch.attachments
  return payload
}

export function JourneyWizard({
  studentId,
  experience,
  step,
}: {
  studentId: string
  experience: JourneyExperience | null
  step: number
}) {
  const router = useRouter()
  const [category, setCategory] = useState<JourneyCategory | null>(
    experience?.category ?? null
  )
  const [fields, setFields] = useState<JourneyDraftFields>(() => toDraftFields(experience))
  const [isCreatingDraft, startCreatingDraft] = useTransition()
  const [createError, setCreateError] = useState<string | null>(null)

  const autosave = useJourneyAutosave(experience?.id ?? "")

  useEffect(() => {
    setFields(toDraftFields(experience))
    setCategory(experience?.category ?? null)
  }, [experience])

  function goToStep(nextStep: number) {
    if (experience) {
      router.push(`/students/${studentId}/journey/${experience.id}/edit?step=${nextStep}`)
    }
  }

  function handleCategoryNext() {
    if (!category) return

    if (experience) {
      goToStep(2)
      return
    }

    setCreateError(null)
    startCreatingDraft(async () => {
      const result = await createJourneyDraft(studentId, category)
      if (result && "experienceId" in result && result.experienceId) {
        router.push(`/students/${studentId}/journey/${result.experienceId}/edit?step=2`)
      } else {
        setCreateError(result?.message ?? "Não foi possível iniciar o cadastro.")
      }
    })
  }

  function handleTextFieldChange(field: TextField, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
    autosave.debouncedSave(toAutosavePayload({ [field]: value }))
  }

  function handleTextFieldBlur(field: TextField) {
    autosave.save(toAutosavePayload({ [field]: fields[field] }))
  }

  function handleLongTextFieldChange(field: LongTextField, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
    autosave.debouncedSave(toAutosavePayload({ [field]: value }))
  }

  function handleLongTextFieldBlur(field: LongTextField) {
    autosave.save(toAutosavePayload({ [field]: fields[field] }))
  }

  function handleToggleSkill(skill: JourneySkill) {
    const nextSkills = fields.skills.includes(skill)
      ? fields.skills.filter((item) => item !== skill)
      : [...fields.skills, skill]
    setFields((prev) => ({ ...prev, skills: nextSkills }))
    autosave.save(toAutosavePayload({ skills: nextSkills }))
  }

  function handleAddAttachment(attachment: JourneyAttachmentInput) {
    const nextAttachments = [...fields.attachments, attachment]
    setFields((prev) => ({ ...prev, attachments: nextAttachments }))
    autosave.save(toAutosavePayload({ attachments: nextAttachments }))
  }

  function handleRemoveAttachment(id: string) {
    const nextAttachments = fields.attachments.filter((item) => item.id !== id)
    setFields((prev) => ({ ...prev, attachments: nextAttachments }))
    autosave.save(toAutosavePayload({ attachments: nextAttachments }))
  }

  const closeHref = `/students/${studentId}/journey/old?tab=timeline`

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          {experience ? "Editar experiência" : "Registrar experiência"}
        </h1>
        <Link
          href={closeHref}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
          Cancelar
        </Link>
      </div>

      <WizardStepIndicator
        currentStep={step}
        autosaveStatus={experience ? autosave.status : undefined}
        lastSavedAt={autosave.lastSavedAt}
      />

      <div className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10 sm:p-6">
        {step === 1 && (
          <Step1Category
            category={category}
            onSelect={setCategory}
            onNext={handleCategoryNext}
            isSubmitting={isCreatingDraft}
            error={createError}
            readOnly={!!experience}
          />
        )}

        {step === 2 && experience && (
          <Step2BasicInfo
            title={fields.title}
            organization={fields.organization}
            startDate={fields.startDate}
            endDate={fields.endDate}
            hours={fields.hours}
            onChange={handleTextFieldChange}
            onBlurField={handleTextFieldBlur}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        )}

        {step === 3 && experience && (
          <Step3StoryReflection
            description={fields.description}
            reflection={fields.reflection}
            onChange={handleLongTextFieldChange}
            onBlurField={handleLongTextFieldBlur}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        )}

        {step === 4 && experience && (
          <Step4Skills
            skills={fields.skills}
            onToggleSkill={handleToggleSkill}
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        )}

        {step === 5 && experience && (
          <Step5Evidence
            attachments={fields.attachments}
            onAdd={handleAddAttachment}
            onRemove={handleRemoveAttachment}
            onBack={() => goToStep(4)}
            onNext={() => goToStep(6)}
          />
        )}

        {step === 6 && experience && category && (
          <Step6Review
            category={category}
            fields={fields}
            onEditStep={goToStep}
            onBack={() => goToStep(5)}
            onNext={() => goToStep(7)}
          />
        )}

        {step === 7 && experience && (
          <Step7Confirmation
            studentId={studentId}
            experienceId={experience.id}
            onBack={() => goToStep(6)}
          />
        )}
      </div>
    </div>
  )
}
