import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'

import { publicEnv } from '@/lib/env/public-env'
import { buildImageProps } from '@/lib/sanity/build-image-props'
import { defaultOpenGraphImage } from '@/lib/seo/default-open-graph-image'

import type { ProjectedImage } from '@/types/sanity-image'

type SeoFields = {
  metaTitle?: string | null
  metaDescription?: string | null
  isIndexable?: boolean | null
  ogImage?: ProjectedImage | null
} | null

type MetadataInput = {
  title?: string | null
  description?: string | null
  path: string
  seo?: SeoFields
  fallbackImage?: ProjectedImage | null
  type?: 'website' | 'article'
}

export function buildMetadata({
  title,
  description,
  path,
  seo,
  fallbackImage,
  type = 'website',
}: MetadataInput): Metadata {
  const resolvedTitle = stegaClean(seo?.metaTitle ?? title) ?? undefined
  const resolvedDescription = stegaClean(seo?.metaDescription ?? description) ?? undefined
  const ogImage = buildImageProps(seo?.ogImage ?? fallbackImage, {
    width: 1200,
    aspectRatio: 1200 / 630,
  })
  const canonicalUrl = new URL(path, publicEnv.siteUrl).toString()

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: canonicalUrl },
    robots: seo?.isIndexable === false ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: canonicalUrl,
      title: resolvedTitle,
      description: resolvedDescription,
      images: ogImage
        ? [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }]
        : [defaultOpenGraphImage],
    },
  }
}
