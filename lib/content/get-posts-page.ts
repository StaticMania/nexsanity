import {
  buildPagination,
  isPageInRange,
  POSTS_PER_PAGE,
  toPageRange,
} from '@/lib/content/pagination'
import type { Pagination } from '@/lib/content/pagination'
import { sanityFetch } from '@/lib/sanity/live'
import { postsPageQuery } from '@/lib/sanity/queries/post-queries'

import type { PostCard } from '@/types/content'

export type PostsPage = {
  posts: PostCard[]
  pagination: Pagination
}

export async function getPostsPage(page: number): Promise<PostsPage | null> {
  const { data } = await sanityFetch({
    query: postsPageQuery,
    params: toPageRange(page, POSTS_PER_PAGE),
  })
  if (!isPageInRange(page, data.total, POSTS_PER_PAGE)) return null
  return { posts: data.posts, pagination: buildPagination(page, data.total, POSTS_PER_PAGE) }
}
