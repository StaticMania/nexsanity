import { defineQuery } from 'next-sanity'

import { ctaFragment, imageFragment, linkFields, seoFragment } from '@/lib/sanity/queries/fragments'

export const settingsQuery = defineQuery(`*[_type == "settings" && _id == "settings"][0]{
  siteTitle,
  logo ${imageFragment},
  primaryNavigation[]{ _key, ${linkFields} },
  secondaryNavigation[]{ _key, ${linkFields} },
  headerCta ${ctaFragment},
  footerTagline,
  footerColumns[]{ _key, title, links[]{ _key, ${linkFields} } },
  socialLinks[]{ _key, platform, url },
  defaultSeo ${seoFragment},
  theme { colorScheme, backgroundColor, surfaceColor, accentColor, foregroundColor }
}`)
