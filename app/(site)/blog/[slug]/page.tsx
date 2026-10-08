import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPost } from '@/lib/content/get-post'
import { getStaticSlugs } from '@/lib/content/get-static-slugs'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { slugParamsSchema } from '@/lib/validations/route-params-schema'

import { PostArticle } from '@/components/blog/post-article'

type PostPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getStaticSlugs('post')
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const parsedParams = slugParamsSchema.safeParse(await params)
  if (!parsedParams.success) return {}
  const post = await getPost(parsedParams.data.slug)
  if (!post) return {}
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    seo: post.seo,
    fallbackImage: post.coverImage,
    type: 'article',
  })
}

export default async function PostPage({ params }: PostPageProps) {
  const parsedParams = slugParamsSchema.safeParse(await params)
  if (!parsedParams.success) notFound()

  const post = await getPost(parsedParams.data.slug)
  if (!post) notFound()

  return <PostArticle post={post} />
}
