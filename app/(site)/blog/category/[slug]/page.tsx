import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCategories } from '@/lib/content/get-categories'
import { getCategoryPostsPage } from '@/lib/content/get-category-posts-page'
import { getStaticSlugs } from '@/lib/content/get-static-slugs'
import { buildMetadata } from '@/lib/seo/build-metadata'
import {
  paginationSearchParamsSchema,
  slugParamsSchema,
} from '@/lib/validations/route-params-schema'

import { BlogIndex } from '@/components/blog/blog-index'

type CategoryPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export function generateStaticParams() {
  return getStaticSlugs('category')
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const parsedParams = slugParamsSchema.safeParse(await params)
  if (!parsedParams.success) return {}
  const categoryPage = await getCategoryPostsPage(parsedParams.data.slug, 1)
  return buildMetadata({
    title: categoryPage?.category.title,
    description: categoryPage?.category.description,
    path: `/blog/category/${parsedParams.data.slug}`,
  })
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const parsedParams = slugParamsSchema.safeParse(await params)
  if (!parsedParams.success) notFound()

  const { slug } = parsedParams.data
  const { page } = paginationSearchParamsSchema.parse(await searchParams)
  const [categoryPage, categories] = await Promise.all([
    getCategoryPostsPage(slug, page),
    getCategories(),
  ])
  if (!categoryPage) notFound()

  const { category, ...postsPage } = categoryPage
  return (
    <BlogIndex
      heading={category.title}
      intro={category.description}
      categories={categories}
      activeCategorySlug={slug}
      basePath={`/blog/category/${slug}`}
      {...postsPage}
    />
  )
}
