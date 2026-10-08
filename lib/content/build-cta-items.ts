import { stegaClean } from 'next-sanity'

import { resolveLinkHref } from '@/lib/sanity/resolve-link-href'
import type { ProjectedLink } from '@/lib/sanity/resolve-link-href'

type ProjectedCta = {
  _key?: string | null
  label: string
  variant: string | null
  link: ProjectedLink | null
}

export type CtaItem = {
  key: string
  href: string
  label: string
  intent: 'primary' | 'secondary'
}

export function buildCtaItem(cta: ProjectedCta | null | undefined): CtaItem | null {
  if (!cta) return null
  const href = resolveLinkHref(cta.link)
  if (!href) return null
  return {
    key: cta._key ?? href,
    href,
    label: cta.label,
    intent: stegaClean(cta.variant) === 'secondary' ? 'secondary' : 'primary',
  }
}

export function buildCtaItems(ctas: ReadonlyArray<ProjectedCta> | null | undefined): CtaItem[] {
  return (ctas ?? []).flatMap((cta) => {
    const item = buildCtaItem(cta)
    return item ? [item] : []
  })
}
