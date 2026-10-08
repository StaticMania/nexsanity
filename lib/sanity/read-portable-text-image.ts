import { buildImageProps } from '@/lib/sanity/build-image-props'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

import type { ProjectedImage } from '@/types/sanity-image'

export type PortableTextImage = {
  image: SanityImageProps
  caption: string | null
}

export function readPortableTextImage(value: unknown): PortableTextImage | null {
  if (!isProjectedImage(value)) return null
  const image = buildImageProps(value, { width: 1600, aspectRatio: 16 / 9 })
  if (!image) return null
  return {
    image,
    caption: 'caption' in value && typeof value.caption === 'string' ? value.caption : null,
  }
}

function isProjectedImage(value: unknown): value is ProjectedImage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'asset' in value &&
    typeof value.asset === 'object' &&
    value.asset !== null &&
    '_id' in value.asset
  )
}
