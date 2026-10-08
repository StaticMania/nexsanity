import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCategories } from '@/lib/content/get-categories'
import { getPostsPage } from '@/lib/content/get-posts-page'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { paginationSearchParamsSchema } from '@/lib/validations/route-params-schema'

import { BlogIndex } from '@/components/blog/blog-index'

type BlogPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description: 'Notes on design, engineering and growing a product.',
  path: '/blog',
})

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = paginationSearchParamsSchema.parse(await searchParams)
  const [postsPage, categories] = await Promise.all([getPostsPage(page), getCategories()])
  if (!postsPage) notFound()

  return (
    <BlogIndex
      heading="Blog"
      intro="Notes on design, engineering and growing a product."
      categories={categories}
      activeCategorySlug={null}
      basePath="/blog"
      {...postsPage}
    />
  )
}
