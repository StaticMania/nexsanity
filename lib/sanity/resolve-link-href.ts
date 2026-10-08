import { stegaClean } from 'next-sanity'

import { HOME_SLUG } from '@/lib/content/home-slug'

export type ProjectedLink = {
  label?: string | null
  linkType: string | null
  externalUrl: string | null
  internal: { _type: string; title?: string | null; slug: string | null } | null
}

export function resolveLinkHref(link: ProjectedLink | null | undefined): string | null {
  if (!link) return null
  if (stegaClean(link.linkType) === 'external') return stegaClean(link.externalUrl) ?? null
  return resolveDocumentHref(link.internal)
}

export function resolveLinkLabel(link: ProjectedLink): string {
  return link.label ?? link.internal?.title ?? 'Untitled link'
}

function resolveDocumentHref(document: ProjectedLink['internal']): string | null {
  if (!document?.slug) return null
  const slug = stegaClean(document.slug)

  switch (document._type) {
    case 'page': {
      return slug === HOME_SLUG ? '/' : `/${slug}`
    }
    case 'post': {
      return `/blog/${slug}`
    }
    case 'caseStudy': {
      return `/customers/${slug}`
    }
    case 'category': {
      return `/blog/category/${slug}`
    }
    default: {
      return null
    }
  }
}
