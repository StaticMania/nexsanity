import { stegaClean } from 'next-sanity'

import { buildNavigationItems } from '@/lib/content/build-navigation-items'

import { SiteLogo } from '@/components/site/site-logo'
import { FooterWordmarkRise } from '@/components/tweenui/footer-wordmark-rise'

import type { SiteSettings } from '@/types/content'

type SiteFooterProps = {
  settings: SiteSettings
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const siteTitle = stegaClean(settings?.siteTitle) ?? 'NexSanity'
  const columns = (settings?.footerColumns ?? []).map((column) => ({
    key: column._key,
    title: column.title,
    items: buildNavigationItems(column.links),
  }))
  const socials = (settings?.socialLinks ?? []).map((socialLink) => ({
    key: socialLink._key,
    platform: stegaClean(socialLink.platform),
    url: stegaClean(socialLink.url),
  }))

  return (
    <FooterWordmarkRise
      brand={siteTitle}
      logo={<SiteLogo siteTitle={siteTitle} logo={settings?.logo} tone="dark" />}
      tagline={settings?.footerTagline ?? null}
      columns={columns}
      socials={socials}
      legalItems={buildNavigationItems(settings?.secondaryNavigation)}
      copyright={`© ${new Date().getUTCFullYear()} ${siteTitle}`}
    />
  )
}
