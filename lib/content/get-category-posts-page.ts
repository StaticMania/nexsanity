import {
  buildPagination,
  isPageInRange,
  POSTS_PER_PAGE,
  toPageRange,
} from '@/lib/content/pagination'
import type { Pagination } from '@/lib/content/pagination'
import { sanityFetch } from '@/lib/sanity/live'
import { categoryPostsPageQuery } from '@/lib/sanity/queries/post-queries'

import type { CategoryDocument, PostCard } from '@/types/content'

export type CategoryPostsPage = {
  category: CategoryDocument
  posts: PostCard[]
  pagination: Pagination
}

export async function getCategoryPostsPage(
  slug: string,
  page: number,
): Promise<CategoryPostsPage | null> {
  const { data } = await sanityFetch({
    query: categoryPostsPageQuery,
    params: { slug, ...toPageRange(page, POSTS_PER_PAGE) },
  })
  if (!data.category || !isPageInRange(page, data.total, POSTS_PER_PAGE)) return null
  return {
    category: data.category,
    posts: data.posts,
    pagination: buildPagination(page, data.total, POSTS_PER_PAGE),
  }
}
