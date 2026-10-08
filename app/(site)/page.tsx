import type { Metadata } from 'next'

import { getPage } from '@/lib/content/get-page'
import { HOME_SLUG } from '@/lib/content/home-slug'
import { buildMetadata } from '@/lib/seo/build-metadata'

import { PageBuilder } from '@/components/blocks/page-builder'
import { EmptyHome } from '@/components/site/empty-home'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(HOME_SLUG)
  return buildMetadata({ path: '/', seo: page?.seo })
}

export default async function HomePage() {
  const page = await getPage(HOME_SLUG)
  if (!page) return <EmptyHome />

  return <PageBuilder blocks={page.pageBuilder} />
}
