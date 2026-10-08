import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCaseStudiesPage } from '@/lib/content/get-case-studies-page'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { paginationSearchParamsSchema } from '@/lib/validations/route-params-schema'

import { CustomersIndex } from '@/components/customers/customers-index'

type CustomersPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export const metadata: Metadata = buildMetadata({
  title: 'Customer stories',
  description: 'How ambitious teams use our work to launch faster, convert better and grow.',
  path: '/customers',
})

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const { page } = paginationSearchParamsSchema.parse(await searchParams)
  const caseStudiesPage = await getCaseStudiesPage(page)
  if (!caseStudiesPage) notFound()

  return <CustomersIndex {...caseStudiesPage} />
}
