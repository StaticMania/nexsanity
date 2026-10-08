import { sanityFetch } from '@/lib/sanity/live'
import { postBySlugQuery } from '@/lib/sanity/queries/post-queries'

import type { PostDocument } from '@/types/content'

export async function getPost(slug: string): Promise<PostDocument | null> {
  const { data: post } = await sanityFetch({ query: postBySlugQuery, params: { slug } })
  return post
}
