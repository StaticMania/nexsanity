import { sanityFetch } from '@/lib/sanity/live'
import { settingsQuery } from '@/lib/sanity/queries/settings-queries'

import type { SiteSettings } from '@/types/content'

export async function getSettings(): Promise<SiteSettings> {
  const { data: settings } = await sanityFetch({ query: settingsQuery })
  return settings
}
