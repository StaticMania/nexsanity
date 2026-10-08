import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { formatDate } from '@/lib/format/format-date'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { PostCard } from '@/components/blog/post-card'
import { BlogHoverExpand } from '@/components/tweenui/blog-hover-expand'

import type { BlockOfType } from '@/types/content'

type LatestPostsBlockProps = {
  block: BlockOfType<'latestPostsBlock'>
  headingLevel: HeadingLevel
}

export function LatestPostsBlock({ block, headingLevel: HeadingTag }: LatestPostsBlockProps) {
  const subheadingLevel = toSubheadingLevel(HeadingTag)
  const latestPosts = block.posts ?? []
  const posts = latestPosts.map((post) => ({
    key: post._id,
    title: post.title,
    href: `/blog/${post.slug}`,
    date: formatDate(post.publishedAt),
    dateTime: post.publishedAt,
    tags: (post.categories ?? []).map((category) => category.title),
    cover: buildImageProps(post.coverImage, { width: 960, aspectRatio: 4 / 3 }),
  }))

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <HeadingTag
              id={`${block._key}-heading`}
              className="text-headline font-medium text-balance"
            >
              {block.heading}
            </HeadingTag>
            {block.intro && <p className="mt-5 text-lg text-pretty opacity-70">{block.intro}</p>}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Read the blog
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {isAnimatedBlock(block.blockOptions) ? (
          <BlogHoverExpand posts={posts} headingLevel={subheadingLevel} />
        ) : (
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {latestPosts.map((post) => (
              <li key={post._id}>
                <PostCard post={post} headingLevel={subheadingLevel} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
