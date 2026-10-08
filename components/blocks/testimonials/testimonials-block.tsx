import Image from 'next/image'

import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { buildDriftColumns } from '@/lib/content/build-drift-columns'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { ColumnDrift } from '@/components/tweenui/column-drift'

import type { BlockOfType } from '@/types/content'

type TestimonialsBlockProps = {
  block: BlockOfType<'testimonialsBlock'>
  headingLevel: HeadingLevel
}

export function TestimonialsBlock({ block, headingLevel: HeadingTag }: TestimonialsBlockProps) {
  const testimonialList = (
    <ul className="gap-4 space-y-4 md:columns-2 lg:columns-3">
      {block.testimonials.map((testimonial) => {
        const avatar = buildImageProps(testimonial.avatar, { width: 96, aspectRatio: 1 })
        return (
          <li key={testimonial._id} className="break-inside-avoid">
            <figure className="rounded-panel bg-canvas p-8 text-ink ring-1 ring-line">
              <blockquote className="text-lg text-pretty">
                <p>“{testimonial.quote}”</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                {avatar && (
                  <Image
                    {...avatar}
                    alt=""
                    sizes="48px"
                    className="size-12 rounded-full object-cover"
                  />
                )}
                <span>
                  <span className="block font-medium">{testimonial.authorName}</span>
                  {(testimonial.authorRole || testimonial.company) && (
                    <span className="block text-sm text-muted">
                      {[testimonial.authorRole, testimonial.company].filter(Boolean).join(', ')}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          </li>
        )
      })}
    </ul>
  )

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions, 'overflow-x-clip')}
    >
      <div className="main-container">
        <HeadingTag
          id={`${block._key}-heading`}
          className="mx-auto max-w-3xl text-center text-headline font-medium text-balance"
        >
          {block.heading}
        </HeadingTag>
        <div className="mt-14">
          {isAnimatedBlock(block.blockOptions) ? (
            <ColumnDrift columns={buildDriftColumns(block.testimonials)} />
          ) : (
            testimonialList
          )}
        </div>
      </div>
    </section>
  )
}
