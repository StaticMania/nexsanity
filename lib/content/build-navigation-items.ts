import { resolveLinkHref, resolveLinkLabel } from '@/lib/sanity/resolve-link-href'
import type { ProjectedLink } from '@/lib/sanity/resolve-link-href'

export type NavigationItem = {
  key: string
  href: string
  label: string
}

export function buildNavigationItems(
  links: ReadonlyArray<ProjectedLink & { _key: string }> | null | undefined,
): NavigationItem[] {
  return (links ?? []).flatMap((link) => {
    const href = resolveLinkHref(link)
    return href ? [{ key: link._key, href, label: resolveLinkLabel(link) }] : []
  })
}

export type SplitNavigationItems = {
  leadingItems: NavigationItem[]
  trailingItems: NavigationItem[]
}

export function splitNavigationItems(items: readonly NavigationItem[]): SplitNavigationItems {
  const splitIndex = Math.ceil(items.length / 2)
  return { leadingItems: items.slice(0, splitIndex), trailingItems: items.slice(splitIndex) }
}
