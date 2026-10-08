import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPage } from '@/lib/content/get-page'
import { getStaticSlugs } from '@/lib/content/get-static-slugs'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { pageSlugParamsSchema } from '@/lib/validations/route-params-schema'

import { PageBuilder } from '@/components/blocks/page-builder'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getStaticSlugs('page')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parsedParams = pageSlugParamsSchema.safeParse(await params)
  if (!parsedParams.success) return {}
  const page = await getPage(parsedParams.data.slug)
  return buildMetadata({ title: page?.title, path: `/${parsedParams.data.slug}`, seo: page?.seo })
}

export default async function Page({ params }: PageProps) {
  const parsedParams = pageSlugParamsSchema.safeParse(await params)
  if (!parsedParams.success) notFound()

  const page = await getPage(parsedParams.data.slug)
  if (!page) notFound()

  return <PageBuilder blocks={page.pageBuilder} />
}
