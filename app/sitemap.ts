import type { MetadataRoute } from 'next'

import { getSitemapEntries } from '@/lib/content/get-sitemap-entries'

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries()
}
