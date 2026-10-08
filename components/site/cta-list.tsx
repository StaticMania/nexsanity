import { cn } from '@/lib/cn'
import type { CtaItem } from '@/lib/content/build-cta-items'

import { ButtonLink } from '@/components/ui/button-link'

type CtaListProps = {
  items: readonly CtaItem[]
  isOnDark?: boolean
  className?: string
}

export function CtaList({ items, isOnDark = false, className }: CtaListProps) {
  if (items.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      {items.map((item) => (
        <li key={item.key}>
          <ButtonLink
            href={item.href}
            size="large"
            intent={resolveIntent(item.intent, isOnDark)}
            className={cn(
              isOnDark &&
                item.intent === 'secondary' &&
                'text-inverse-ink ring-inverse-ink/25 hover:ring-inverse-ink/60',
            )}
          >
            {item.label}
          </ButtonLink>
        </li>
      ))}
    </ul>
  )
}

function resolveIntent(intent: CtaItem['intent'], isOnDark: boolean) {
  if (intent === 'secondary') return 'secondary'
  return isOnDark ? 'inverse' : 'primary'
}
