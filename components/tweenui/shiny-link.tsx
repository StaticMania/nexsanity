import { Sparkles } from 'lucide-react'
import Link from 'next/link'

import { isExternalHref } from '@/lib/ui/is-external-href'

import { RollText } from '@/components/ui/roll-text'

type ShinyLinkProps = {
  href: string
  children: string
}

export function ShinyLink({ href, children }: ShinyLinkProps) {
  const isExternal = isExternalHref(href)

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group group/roll relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-7 text-sm font-medium text-canvas transition-colors duration-300 hover:bg-ink/90 motion-reduce:transition-none"
    >
      <span aria-hidden="true" className="shine-sweep" />
      <Sparkles
        aria-hidden="true"
        className="relative size-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 motion-reduce:transition-none"
      />
      <span className="relative">
        <RollText>{children}</RollText>
      </span>
    </Link>
  )
}
