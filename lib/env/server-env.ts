import 'server-only'

import { serverEnvSchema } from '@/lib/validations/env-schema'
import type { ServerEnv } from '@/lib/validations/env-schema'

export const serverEnv: ServerEnv = serverEnvSchema.parse({
  sanityApiReadToken: process.env.SANITY_API_READ_TOKEN,
  sanityApiBrowserToken: process.env.SANITY_API_BROWSER_TOKEN,
  resendApiKey: process.env.RESEND_API_KEY,
  contactToEmail: process.env.CONTACT_TO_EMAIL,
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || undefined,
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
})
