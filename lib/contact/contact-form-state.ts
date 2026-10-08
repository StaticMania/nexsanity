import type { ActionResult } from '@/lib/errors/action-result'

export type ContactFormState = ActionResult<{ isDelivered: true }> | null
