import type { MetadataRoute } from 'next'

import { HOME_SLUG } from '@/lib/content/home-slug'
import { publicEnv } from '@/lib/env/public-env'
import { sanityFetch } from '@/lib/sanity/live'
import { sitemapQuery } from '@/lib/sanity/queries/sitemap-queries'

type SitemapDocument = { slug: string | null; _updatedAt: string }

const staticPaths = ['/blog', '/customers']

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const { data } = await sanityFetch({
    query: sitemapQuery,
    perspective: 'published',
    stega: false,
  })

  const documentEntries = [
    ...toEntries(data.pages, (slug) => (slug === HOME_SLUG ? '/' : `/${slug}`)),
    ...toEntries(data.posts, (slug) => `/blog/${slug}`),
    ...toEntries(data.caseStudies, (slug) => `/customers/${slug}`),
    ...toEntries(data.categories, (slug) => `/blog/category/${slug}`),
  ]

  return [
    ...staticPaths.map((path) => ({ url: new URL(path, publicEnv.siteUrl).toString() })),
    ...documentEntries,
  ]
}

function toEntries(
  documents: readonly SitemapDocument[],
  toPath: (slug: string) => string,
): MetadataRoute.Sitemap {
  return documents.flatMap(({ slug, _updatedAt }) =>
    slug
      ? [
          {
            url: new URL(toPath(slug), publicEnv.siteUrl).toString(),
            lastModified: new Date(_updatedAt),
          },
        ]
      : [],
  )
}
