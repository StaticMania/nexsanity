import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { SubheadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import type { CaseStudyCard as CaseStudyCardData } from '@/types/content'

type CaseStudyCardProps = {
  caseStudy: CaseStudyCardData
  headingLevel: SubheadingLevel
}

export function CaseStudyCard({ caseStudy, headingLevel: HeadingTag }: CaseStudyCardProps) {
  const coverImage = buildImageProps(caseStudy.coverImage, { width: 960, aspectRatio: 4 / 3 })
  const metrics = (caseStudy.metrics ?? []).slice(0, 2)

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-panel bg-surface">
        {coverImage && (
          <Image
            {...coverImage}
            alt={coverImage.alt}
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-104"
          />
        )}
        {metrics.length > 0 && (
          <dl className="absolute inset-x-4 bottom-4 flex items-end gap-2">
            {metrics.map((metric) => (
              <div
                key={metric._key}
                className="flex flex-col-reverse rounded-card bg-canvas/90 px-4 py-3 text-ink backdrop-blur"
              >
                <dt className="text-xs opacity-60">{metric.label}</dt>
                <dd className="text-xl font-medium tracking-tight">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <p className="mt-6 text-sm opacity-60">{caseStudy.client?.name}</p>
      <HeadingTag className="mt-2 text-2xl font-medium tracking-tight text-balance">
        <Link href={`/customers/${caseStudy.slug}`} className="after:absolute after:inset-0">
          {caseStudy.title}
        </Link>
      </HeadingTag>
      <p className="mt-3 line-clamp-2 text-pretty opacity-70">{caseStudy.summary}</p>
      <span
        aria-hidden="true"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        Read the story
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </article>
  )
}
