import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { buildShareLinks } from '@/lib/content/build-share-links'
import { buildTableOfContents } from '@/lib/content/build-table-of-contents'
import { formatYear } from '@/lib/format/format-year'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { CaseStudyCard } from '@/components/customers/case-study-card'
import { PortableTextBody } from '@/components/portable-text/portable-text-body'

import type { CaseStudyDocument } from '@/types/content'

type CaseStudyArticleProps = {
  caseStudy: CaseStudyDocument
}

export function CaseStudyArticle({ caseStudy }: CaseStudyArticleProps) {
  const coverImage = buildImageProps(caseStudy.coverImage, { width: 1800, aspectRatio: 12 / 5 })
  const clientLogo = buildImageProps(caseStudy.client?.logo, { width: 320 })
  const testimonial = caseStudy.testimonial
  const testimonialAvatar = buildImageProps(testimonial?.avatar, { width: 112, aspectRatio: 1 })
  const tableOfContents = buildTableOfContents(caseStudy.body)
  const shareLinks = buildShareLinks(`/customers/${caseStudy.slug}`, caseStudy.title)
  const galleryImages = (caseStudy.gallery ?? []).flatMap((image, index) => {
    const isWide = index % 3 === 0
    const imageProps = buildImageProps(image, {
      width: isWide ? 1400 : 700,
      aspectRatio: isWide ? 16 / 9 : 4 / 5,
    })
    return imageProps ? [{ key: image._key, isWide, image: imageProps }] : []
  })
  const facts = [
    { term: 'Client', detail: caseStudy.client?.name },
    { term: 'Industry', detail: caseStudy.industry },
    { term: 'Services', detail: caseStudy.services?.join(', ') },
    { term: 'Duration', detail: caseStudy.duration },
    { term: 'Year', detail: formatYear(caseStudy.publishedAt) },
  ].filter((fact): fact is { term: string; detail: string } => Boolean(fact.detail))

  return (
    <>
      <article className="pt-12 pb-24 md:pt-20">
        <div className="main-container">
          <header className="mx-auto max-w-4xl text-center">
            {caseStudy.industry && (
              <p className="inline-flex rounded-full bg-surface px-3 py-1 text-sm">
                {caseStudy.industry}
              </p>
            )}
            <h1 className="mt-6 text-headline font-medium text-balance">{caseStudy.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-pretty text-muted">
              {caseStudy.summary}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
              {clientLogo ? (
                <Image
                  {...clientLogo}
                  alt={caseStudy.client?.name ?? ''}
                  sizes="160px"
                  className="h-6 w-auto"
                />
              ) : (
                <span className="font-medium">{caseStudy.client?.name}</span>
              )}
              {caseStudy.publishedAt && (
                <time dateTime={caseStudy.publishedAt} className="text-muted">
                  {formatYear(caseStudy.publishedAt)}
                </time>
              )}
              {caseStudy.duration && (
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <Clock aria-hidden="true" className="size-4" />
                  {caseStudy.duration}
                </span>
              )}
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

          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <dl className="mt-6 grid divide-y divide-line rounded-panel bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {caseStudy.metrics.map((metric) => (
                <div key={metric._key} className="flex flex-col-reverse p-6 md:p-8">
                  <dt className="mt-1 text-sm text-muted">{metric.label}</dt>
                  <dd className="font-serif text-4xl tracking-tight md:text-5xl">{metric.value}</dd>
                </div>
              ))}
            </dl>
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
                {facts.length > 0 && (
                  <div>
                    <p className="text-xs tracking-widest text-muted uppercase">Project facts</p>
                    <dl className="mt-4 divide-y divide-line border-y border-line">
                      {facts.map((fact) => (
                        <div key={fact.term} className="py-3 text-sm">
                          <dt className="text-muted">{fact.term}</dt>
                          <dd className="mt-0.5 font-medium">{fact.detail}</dd>
                        </div>
                      ))}
                    </dl>
                    {caseStudy.client?.websiteUrl && (
                      <Link
                        href={caseStudy.client.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                      >
                        Visit {caseStudy.client.name}
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </Link>
                    )}
                  </div>
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
              <PortableTextBody value={caseStudy.body} />

              {galleryImages.length > 0 && (
                <section aria-labelledby="gallery-heading" className="mt-16">
                  <h2 id="gallery-heading" className="text-2xl font-medium tracking-tight">
                    Selected screens and moments
                  </h2>
                  <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                    {galleryImages.map(({ key, isWide, image }) => (
                      <li key={key} className={cn(isWide && 'sm:col-span-2')}>
                        <Image
                          {...image}
                          alt={image.alt}
                          sizes={
                            isWide
                              ? '(min-width: 1024px) 60vw, 100vw'
                              : '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw'
                          }
                          className="max-h-cover w-full rounded-panel object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {testimonial && (
                <figure className="mt-16 rounded-panel bg-inverse p-8 text-inverse-ink md:p-12">
                  <blockquote className="font-serif text-2xl leading-snug text-balance md:text-3xl">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4">
                    {testimonialAvatar && (
                      <Image
                        {...testimonialAvatar}
                        alt=""
                        sizes="56px"
                        className="size-14 rounded-full object-cover"
                      />
                    )}
                    <span>
                      <span className="block font-medium">{testimonial.authorName}</span>
                      <span className="block text-sm text-inverse-muted">
                        {[testimonial.authorRole, testimonial.company].filter(Boolean).join(', ')}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              )}

              {(caseStudy.previousCaseStudy || caseStudy.nextCaseStudy) && (
                <nav aria-label="More customer stories" className="mt-12 grid gap-4 sm:grid-cols-2">
                  {caseStudy.previousCaseStudy ? (
                    <Link
                      href={`/customers/${caseStudy.previousCaseStudy.slug}`}
                      className="rounded-panel p-6 ring-1 ring-line transition-colors hover:bg-surface"
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Previous
                      </span>
                      <span className="mt-2 block font-medium text-balance">
                        {caseStudy.previousCaseStudy.title}
                      </span>
                    </Link>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {caseStudy.nextCaseStudy && (
                    <Link
                      href={`/customers/${caseStudy.nextCaseStudy.slug}`}
                      className="rounded-panel p-6 text-right ring-1 ring-line transition-colors hover:bg-surface"
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                        Next
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </span>
                      <span className="mt-2 block font-medium text-balance">
                        {caseStudy.nextCaseStudy.title}
                      </span>
                    </Link>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </article>

      {caseStudy.relatedCaseStudies.length > 0 && (
        <section
          aria-labelledby="related-stories-heading"
          className="border-t border-line bg-surface py-24"
        >
          <div className="main-container">
            <h2 id="related-stories-heading" className="text-3xl font-medium tracking-tight">
              More customer stories
            </h2>
            <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {caseStudy.relatedCaseStudies.map((relatedCaseStudy) => (
                <li key={relatedCaseStudy._id}>
                  <CaseStudyCard caseStudy={relatedCaseStudy} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
