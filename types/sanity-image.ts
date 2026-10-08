import type { SanityImageCrop, SanityImageHotspot } from '@/sanity/sanity.types'

export type ProjectedImage = {
  alt: string | null
  isDecorative: boolean | null
  crop: SanityImageCrop | null
  hotspot: SanityImageHotspot | null
  asset: {
    _id: string
    url: string
    metadata: {
      lqip: string | null
      dimensions: { width: number; height: number } | null
    } | null
  } | null
}
