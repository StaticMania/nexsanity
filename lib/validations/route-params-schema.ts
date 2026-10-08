import { z } from 'zod'

import { HOME_SLUG } from '@/lib/content/home-slug'

const slugSchema = z
  .string()
  .max(96)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

export const slugParamsSchema = z.object({ slug: slugSchema })

export const pageSlugParamsSchema = z.object({
  slug: slugSchema.refine((slug) => slug !== HOME_SLUG),
})

export const paginationSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).catch(1),
})

export type SlugParams = z.infer<typeof slugParamsSchema>
export type PaginationSearchParams = z.infer<typeof paginationSearchParamsSchema>
