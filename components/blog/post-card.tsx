import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format/format-date'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import type { PostCard as PostCardData } from '@/types/content'

type PostCardProps = {
  post: PostCardData
  headingLevel: 'h2' | 'h3'
  isFeatured?: boolean
}

export function PostCard({ post, headingLevel: HeadingTag, isFeatured = false }: PostCardProps) {
  const coverImage = buildImageProps(post.coverImage, {
    width: isFeatured ? 1400 : 800,
    aspectRatio: isFeatured ? 16 / 10 : 4 / 3,
  })
  const primaryCategory = post.categories?.[0]

  return (
    <article
      className={cn(
        'group relative flex flex-col',
        isFeatured && 'gap-8 lg:grid lg:grid-cols-2 lg:items-center',
      )}
    >
      {coverImage && (
        <div className="overflow-hidden rounded-panel bg-surface">
          <Image
            {...coverImage}
            alt={coverImage.alt}
            sizes={
              isFeatured
                ? '(min-width: 1024px) 50vw, 100vw'
                : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
            }
            className="w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-104"
          />
        </div>
      )}
      <div className={cn(!isFeatured && 'mt-6')}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          {primaryCategory && <span>{primaryCategory.title}</span>}
          {primaryCategory && <span aria-hidden="true">·</span>}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <HeadingTag
          className={cn(
            'mt-3 font-medium tracking-tight text-balance',
            isFeatured ? 'text-headline' : 'text-2xl',
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </HeadingTag>
        <p className={cn('mt-3 text-pretty text-muted', isFeatured ? 'text-lg' : 'line-clamp-2')}>
          {post.excerpt}
        </p>
        {isFeatured && post.author && <p className="mt-6 text-sm">By {post.author.name}</p>}
      </div>
    </article>
  )
}
