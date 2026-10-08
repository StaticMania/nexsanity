import { stegaClean } from 'next-sanity'

import { urlForImage } from '@/lib/sanity/image-url'

import type { ProjectedImage } from '@/types/sanity-image'

type ImagePropsOptions = {
  width: number
  aspectRatio?: number
}

export type SanityImageProps = {
  src: string
  width: number
  height: number
  alt: string
  placeholder: 'blur' | 'empty'
  blurDataURL?: string
}

export function buildImageProps(
  image: ProjectedImage | null | undefined,
  { width, aspectRatio }: ImagePropsOptions,
): SanityImageProps | null {
  if (!image?.asset) return null

  const dimensions = image.asset.metadata?.dimensions
  const intrinsicRatio = dimensions ? dimensions.width / dimensions.height : 1
  const height = Math.round(width / (aspectRatio ?? intrinsicRatio))
  const lqip = image.asset.metadata?.lqip ?? undefined

  return {
    src: urlForImage({ ...image, asset: image.asset })
      .width(width)
      .height(height)
      .fit('crop')
      .auto('format')
      .url(),
    width,
    height,
    alt: image.isDecorative ? '' : (stegaClean(image.alt) ?? ''),
    placeholder: lqip ? 'blur' : 'empty',
    blurDataURL: lqip,
  }
}
