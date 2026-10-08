import { sanityFetch } from '@/lib/sanity/live'
import { categoriesQuery } from '@/lib/sanity/queries/post-queries'

import type { CategorySummary } from '@/types/content'

export async function getCategories(): Promise<CategorySummary[]> {
  const { data: categories } = await sanityFetch({ query: categoriesQuery })
  return categories
}
