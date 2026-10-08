import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'

import { publicEnv } from '@/lib/env/public-env'
import { buildImageProps } from '@/lib/sanity/build-image-props'
import { defaultOpenGraphImage } from '@/lib/seo/default-open-graph-image'

import type { SiteSettings } from '@/types/content'

const fallbackSiteTitle = 'NexSanity'

export function buildRootMetadata(settings: SiteSettings): Metadata {
  const siteTitle = stegaClean(settings?.siteTitle) ?? fallbackSiteTitle
  const defaultSeo = settings?.defaultSeo
  const description = stegaClean(defaultSeo?.metaDescription) ?? undefined
  const ogImage = buildImageProps(defaultSeo?.ogImage, { width: 1200, aspectRatio: 1200 / 630 })

  return {
    metadataBase: new URL(publicEnv.siteUrl),
    title: {
      template: `%s | ${siteTitle}`,
      default: stegaClean(defaultSeo?.metaTitle) ?? siteTitle,
    },
    description,
    openGraph: {
      siteName: siteTitle,
      images: ogImage
        ? [{ url: ogImage.src, width: ogImage.width, height: ogImage.height }]
        : [defaultOpenGraphImage],
    },
    robots: defaultSeo?.isIndexable === false ? { index: false, follow: false } : undefined,
  }
}
