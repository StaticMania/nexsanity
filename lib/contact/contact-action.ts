'use server'

import type { ContactFormState } from '@/lib/contact/contact-form-state'
import { getClientIp } from '@/lib/contact/get-client-ip'
import { handleContactSubmission } from '@/lib/contact/handle-contact-submission'
import { parseContactForm } from '@/lib/contact/parse-contact-form'
import { toActionResult } from '@/lib/errors/to-action-result'

export async function submitContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const input = parseContactForm(formData)
    await handleContactSubmission(input, await getClientIp())
    return { ok: true, data: { isDelivered: true } }
  } catch (error) {
    return toActionResult(error, { action: 'submitContactMessage' })
  }
}
