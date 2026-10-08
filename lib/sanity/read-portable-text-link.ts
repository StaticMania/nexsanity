import { resolveLinkHref } from '@/lib/sanity/resolve-link-href'
import type { ProjectedLink } from '@/lib/sanity/resolve-link-href'

export function readPortableTextLinkHref(markValue: unknown): string | null {
  return isProjectedLink(markValue) ? resolveLinkHref(markValue) : null
}

function isProjectedLink(value: unknown): value is ProjectedLink {
  return typeof value === 'object' && value !== null && 'linkType' in value
}
