import { AppError, appErrorCodes } from '@/lib/errors/app-error'
import type { FieldErrors } from '@/lib/errors/app-error'
import { contactSchema } from '@/lib/validations/contact-schema'
import type { ContactInput } from '@/lib/validations/contact-schema'

export function readContactFormData(formData: FormData): Record<string, unknown> {
  return {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    subject: formData.get('subject') ?? '',
    company: formData.get('company') ?? '',
    message: formData.get('message') ?? '',
    website: formData.get('website') ?? '',
  }
}

export function collectContactFieldErrors(formValues: Record<string, unknown>): FieldErrors | null {
  const parsed = contactSchema.safeParse(formValues)
  if (parsed.success) return null

  const fieldErrors: FieldErrors = {}
  for (const issue of parsed.error.issues) {
    const fieldName = issue.path[0]
    if (typeof fieldName === 'string' && !fieldErrors[fieldName]) {
      fieldErrors[fieldName] = issue.message
    }
  }
  return fieldErrors
}

export function parseContactForm(formData: FormData): ContactInput {
  const formValues = readContactFormData(formData)
  const parsed = contactSchema.safeParse(formValues)
  if (parsed.success) return parsed.data

  throw new AppError({
    code: appErrorCodes.validationFailed,
    message: 'Please check the highlighted fields.',
    status: 400,
    fieldErrors: collectContactFieldErrors(formValues) ?? undefined,
  })
}
