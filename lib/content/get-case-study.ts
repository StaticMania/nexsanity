import { sanityFetch } from '@/lib/sanity/live'
import { caseStudyBySlugQuery } from '@/lib/sanity/queries/case-study-queries'

import type { CaseStudyDocument } from '@/types/content'

export async function getCaseStudy(slug: string): Promise<CaseStudyDocument | null> {
  const { data: caseStudy } = await sanityFetch({ query: caseStudyBySlugQuery, params: { slug } })
  return caseStudy
}
