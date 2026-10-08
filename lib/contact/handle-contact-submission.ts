import 'server-only'

import { assertContactRateLimit } from '@/lib/contact/rate-limit'
import { sendContactMessage } from '@/lib/contact/send-contact-message'
import type { ContactInput } from '@/lib/validations/contact-schema'

export async function handleContactSubmission(
  input: ContactInput,
  clientIp: string,
): Promise<void> {
  if (input.website) return
  await assertContactRateLimit(clientIp)
  await sendContactMessage(input)
}
