import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { buildShareLinks } from '@/lib/content/build-share-links'
import { buildTableOfContents } from '@/lib/content/build-table-of-contents'
import { formatDate } from '@/lib/format/format-date'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { PostCard } from '@/components/blog/post-card'
import { PortableTextBody } from '@/components/portable-text/portable-text-body'

import type { PostDocument } from '@/types/content'

type PostArticleProps = {
  post: PostDocument
}

export function PostArticle({ post }: PostArticleProps) {
  const coverImage = buildImageProps(post.coverImage, { width: 1800, aspectRatio: 12 / 5 })
  const authorAvatar = buildImageProps(post.author?.avatar, { width: 160, aspectRatio: 1 })
  const tableOfContents = buildTableOfContents(post.body)
  const shareLinks = buildShareLinks(`/blog/${post.slug}`, post.title)
  const readingTime = Math.max(1, post.readingTimeMinutes)

  return (
    <>
      <article className="pt-12 pb-24 md:pt-20">
        <div className="main-container">
          <header className="mx-auto max-w-4xl text-center">
            <ul className="flex flex-wrap justify-center gap-2">
              {(post.categories ?? []).map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="inline-flex rounded-full bg-surface px-3 py-1 text-sm hover:bg-line"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
            <h1 className="mt-6 text-headline font-medium text-balance">{post.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-pretty text-muted">{post.excerpt}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-3">
                {authorAvatar && (
                  <Image
                    {...authorAvatar}
                    alt=""
                    sizes="40px"
                    className="size-10 rounded-full object-cover"
                  />
                )}
                <span className="font-medium">{post.author?.name}</span>
              </span>
              <time dateTime={post.publishedAt} className="text-muted">
                {formatDate(post.publishedAt)}
              </time>
              <span className="inline-flex items-center gap-1.5 text-muted">
                <Clock aria-hidden="true" className="size-4" />
                {readingTime} min read
              </span>
            </div>
          </header>

          {coverImage && (
            <Image
              {...coverImage}
              alt={coverImage.alt}
              preload
              sizes="(min-width: 1536px) 1440px, 100vw"
              className="mt-12 aspect-16/10 max-h-cover w-full rounded-panel object-cover md:aspect-12/5"
            />
          )}

          <div className="mx-auto mt-16 grid max-w-[85%] gap-5 lg:grid-cols-12">
            <aside className="lg:col-span-3 lg:col-start-10 lg:row-start-1">
              <div className="space-y-10 lg:sticky lg:top-32">
                {tableOfContents.length > 0 && (
                  <nav aria-label="On this page">
                    <p className="text-xs tracking-widest text-muted uppercase">On this page</p>
                    <ol className="mt-4 space-y-3 border-l border-line">
                      {tableOfContents.map((entry) => (
                        <li key={entry.id}>
                          <Link
                            href={`#${entry.id}`}
                            scroll={false}
                            className="-ml-px block border-l border-transparent pl-4 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            {entry.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <div>
                  <p className="text-xs tracking-widest text-muted uppercase">Share</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {shareLinks.map((shareLink) => (
                      <li key={shareLink.key}>
                        <Link
                          href={shareLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-full px-4 py-2 text-sm ring-1 ring-line transition-colors hover:bg-surface"
                        >
                          {shareLink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            <div className="min-w-0 lg:col-span-8 lg:col-start-1 lg:row-start-1">
              <PortableTextBody value={post.body} />

              {post.author && (
                <section
                  aria-labelledby="author-heading"
                  className="mt-16 flex flex-col gap-6 rounded-panel bg-surface p-8 sm:flex-row sm:items-start"
                >
                  {authorAvatar && (
                    <Image
                      {...authorAvatar}
                      alt=""
                      sizes="80px"
                      className="size-20 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-xs tracking-widest text-muted uppercase">Written by</p>
                    <h2 id="author-heading" className="mt-2 text-xl font-medium">
                      {post.author.name}
                    </h2>
                    {post.author.role && <p className="text-sm text-accent">{post.author.role}</p>}
                    {post.author.bio && (
                      <p className="mt-3 text-pretty text-muted">{post.author.bio}</p>
                    )}
                  </div>
                </section>
              )}

              {(post.previousPost || post.nextPost) && (
                <nav aria-label="More posts" className="mt-12 grid gap-4 sm:grid-cols-2">
                  {post.previousPost ? (
                    <Link
                      href={`/blog/${post.previousPost.slug}`}
                      className="rounded-panel p-6 ring-1 ring-line transition-colors hover:bg-surface"
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Previous
                      </span>
                      <span className="mt-2 block font-medium text-balance">
                        {post.previousPost.title}
                      </span>
                    </Link>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {post.nextPost && (
                    <Link
                      href={`/blog/${post.nextPost.slug}`}
                      className="rounded-panel p-6 text-right ring-1 ring-line transition-colors hover:bg-surface"
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                        Next
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </span>
                      <span className="mt-2 block font-medium text-balance">
                        {post.nextPost.title}
                      </span>
                    </Link>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </article>

      {post.relatedPosts.length > 0 && (
        <section
          aria-labelledby="related-posts-heading"
          className="border-t border-line bg-surface py-24"
        >
          <div className="main-container">
            <h2 id="related-posts-heading" className="text-3xl font-medium tracking-tight">
              Keep reading
            </h2>
            <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {post.relatedPosts.map((relatedPost) => (
                <li key={relatedPost._id}>
                  <PostCard post={relatedPost} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
