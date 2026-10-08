import {
  buildPagination,
  CASE_STUDIES_PER_PAGE,
  isPageInRange,
  toPageRange,
} from '@/lib/content/pagination'
import type { Pagination } from '@/lib/content/pagination'
import { sanityFetch } from '@/lib/sanity/live'
import { caseStudiesPageQuery } from '@/lib/sanity/queries/case-study-queries'

import type { CaseStudyCard } from '@/types/content'

export type CaseStudiesPage = {
  caseStudies: CaseStudyCard[]
  pagination: Pagination
}

export async function getCaseStudiesPage(page: number): Promise<CaseStudiesPage | null> {
  const { data } = await sanityFetch({
    query: caseStudiesPageQuery,
    params: toPageRange(page, CASE_STUDIES_PER_PAGE),
  })
  if (!isPageInRange(page, data.total, CASE_STUDIES_PER_PAGE)) return null
  return {
    caseStudies: data.caseStudies,
    pagination: buildPagination(page, data.total, CASE_STUDIES_PER_PAGE),
  }
}
