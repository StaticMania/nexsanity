import { sanityFetch } from '@/lib/sanity/live'
import { caseStudySlugsQuery } from '@/lib/sanity/queries/case-study-queries'
import { pageSlugsQuery } from '@/lib/sanity/queries/page-queries'
import { categorySlugsQuery, postSlugsQuery } from '@/lib/sanity/queries/post-queries'
import type { SlugParams } from '@/lib/validations/route-params-schema'

const slugQueries = {
  page: pageSlugsQuery,
  post: postSlugsQuery,
  category: categorySlugsQuery,
  caseStudy: caseStudySlugsQuery,
} as const

export type SlugDocumentType = keyof typeof slugQueries

export async function getStaticSlugs(documentType: SlugDocumentType): Promise<SlugParams[]> {
  const { data: documents } = await sanityFetch({
    query: slugQueries[documentType],
    perspective: 'published',
    stega: false,
  })
  return documents.flatMap(({ slug }) => (slug ? [{ slug }] : []))
}
