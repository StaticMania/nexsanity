import { sanityFetch } from '@/lib/sanity/live'
import { pageBySlugQuery } from '@/lib/sanity/queries/page-queries'

import type { PageDocument } from '@/types/content'

export async function getPage(slug: string): Promise<PageDocument | null> {
  const { data: page } = await sanityFetch({ query: pageBySlugQuery, params: { slug } })
  return page
}
