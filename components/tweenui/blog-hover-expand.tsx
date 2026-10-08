'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/cn'
import type { SubheadingLevel } from '@/lib/content/heading-levels'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

export type ExpandPost = {
  key: string
  title: string
  href: string
  date: string
  dateTime: string
  tags: readonly string[]
  cover: SanityImageProps | null
}

type BlogHoverExpandProps = {
  posts: readonly ExpandPost[]
  headingLevel: SubheadingLevel
}

export function BlogHoverExpand({ posts, headingLevel: HeadingTag }: BlogHoverExpandProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <ul className="flex flex-col gap-10 lg:flex-row lg:gap-8">
      {posts.map((post, index) => {
        const isActive = activeIndex === index
        return (
          <li
            key={post.key}
            onPointerEnter={() => setActiveIndex(index)}
            onFocusCapture={() => setActiveIndex(index)}
            className={cn(
              'min-w-0 transition-[flex-basis] duration-700 ease-in-out motion-reduce:transition-none',
              isActive ? 'lg:basis-1/2' : 'lg:basis-1/4',
            )}
          >
            <article className="group relative space-y-5">
              <div className="h-64 overflow-hidden rounded-panel bg-surface md:h-72">
                {post.cover && (
                  <Image
                    src={post.cover.src}
                    width={post.cover.width}
                    height={post.cover.height}
                    alt={post.cover.alt}
                    placeholder={post.cover.placeholder}
                    blurDataURL={post.cover.blurDataURL}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="size-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-2 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
                  />
                )}
              </div>
              <div className="space-y-3 px-1">
                <p className="text-sm text-muted">
                  <time dateTime={post.dateTime}>{post.date}</time>
                </p>
                {post.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-surface px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                <HeadingTag className="text-xl leading-snug font-medium text-balance">
                  <Link href={post.href} className="after:absolute after:inset-0">
                    <span className="title-underline pb-px">{post.title}</span>
                  </Link>
                </HeadingTag>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
