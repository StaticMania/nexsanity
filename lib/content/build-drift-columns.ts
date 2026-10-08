import { buildImageProps } from '@/lib/sanity/build-image-props'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

import type { BlockOfType } from '@/types/content'

type ProjectedTestimonial = BlockOfType<'testimonialsBlock'>['testimonials'][number]

export type DriftTestimonial = {
  key: string
  name: string
  role: string
  avatar: SanityImageProps | null
  highlight: string
  remainder: string
}

const columnCount = 3
const firstSentencePattern = /^(.+?[.!?])(\s+.*)?$/s

export function buildDriftColumns(
  testimonials: readonly ProjectedTestimonial[],
): DriftTestimonial[][] {
  const columns: DriftTestimonial[][] = Array.from({ length: columnCount }, () => [])

  testimonials.forEach((testimonial, position) => {
    const [, highlight = testimonial.quote, remainder = ''] =
      firstSentencePattern.exec(testimonial.quote) ?? []
    columns[position % columnCount]?.push({
      key: testimonial._id,
      name: testimonial.authorName,
      role: [testimonial.authorRole, testimonial.company].filter(Boolean).join(', '),
      avatar: buildImageProps(testimonial.avatar, { width: 112, aspectRatio: 1 }),
      highlight,
      remainder: remainder.trim(),
    })
  })

  return columns.filter((column) => column.length > 0)
}
