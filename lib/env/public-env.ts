import { publicEnvSchema } from '@/lib/validations/env-schema'
import type { PublicEnv } from '@/lib/validations/env-schema'

export const publicEnv: PublicEnv = publicEnvSchema.parse({
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || undefined,
  sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || undefined,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || undefined,
})
