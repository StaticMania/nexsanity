import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCaseStudy } from '@/lib/content/get-case-study'
import { getStaticSlugs } from '@/lib/content/get-static-slugs'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { slugParamsSchema } from '@/lib/validations/route-params-schema'

import { CaseStudyArticle } from '@/components/customers/case-study-article'

type CaseStudyPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getStaticSlugs('caseStudy')
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const parsedParams = slugParamsSchema.safeParse(await params)
  if (!parsedParams.success) return {}
  const caseStudy = await getCaseStudy(parsedParams.data.slug)
  if (!caseStudy) return {}
  return buildMetadata({
    title: caseStudy.title,
    description: caseStudy.summary,
    path: `/customers/${caseStudy.slug}`,
    fallbackImage: caseStudy.coverImage,
    type: 'article',
  })
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const parsedParams = slugParamsSchema.safeParse(await params)
  if (!parsedParams.success) notFound()

  const caseStudy = await getCaseStudy(parsedParams.data.slug)
  if (!caseStudy) notFound()

  return <CaseStudyArticle caseStudy={caseStudy} />
}
