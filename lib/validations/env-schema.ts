import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional()

export const publicEnvSchema = z.object({
  sanityProjectId: z
    .string({ error: 'NEXT_PUBLIC_SANITY_PROJECT_ID is required' })
    .regex(/^[a-z0-9-]+$/, 'NEXT_PUBLIC_SANITY_PROJECT_ID must be a Sanity project ID'),
  sanityDataset: z
    .string()
    .regex(/^[a-z0-9_-]+$/, 'NEXT_PUBLIC_SANITY_DATASET must be a dataset name')
    .default('production'),
  sanityApiVersion: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'NEXT_PUBLIC_SANITY_API_VERSION must be a YYYY-MM-DD date')
    .default('2026-10-01'),
  siteUrl: z.url().default('http://localhost:3000'),
})

export const serverEnvSchema = z.object({
  sanityApiReadToken: optionalString,
  sanityApiBrowserToken: optionalString,
  resendApiKey: optionalString,
  contactToEmail: z
    .email()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  contactFromEmail: z.string().trim().default('NexSanity <onboarding@resend.dev>'),
  upstashRedisRestUrl: z
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  upstashRedisRestToken: optionalString,
})

export type PublicEnv = z.infer<typeof publicEnvSchema>
export type ServerEnv = z.infer<typeof serverEnvSchema>
