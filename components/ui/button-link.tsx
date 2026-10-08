import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import {
  buttonArrowClassName,
  buttonArrowIconClassName,
  buttonClassName,
} from '@/lib/ui/button-class-name'
import type { ButtonIntent, ButtonSize } from '@/lib/ui/button-class-name'
import { isExternalHref } from '@/lib/ui/is-external-href'

import { RollText } from '@/components/ui/roll-text'

type ButtonLinkProps = {
  href: string
  intent?: ButtonIntent
  size?: ButtonSize
  hasArrow?: boolean
  className?: string
  children: string
}

export function ButtonLink({
  href,
  intent,
  size,
  hasArrow = intent !== 'ghost',
  className,
  children,
}: ButtonLinkProps) {
  const isExternal = isExternalHref(href)

  return (
    <Link
      href={href}
      className={buttonClassName({
        intent,
        size,
        hasArrow,
        className: cn('group/roll', className),
      })}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <RollText>{children}</RollText>
      {hasArrow && (
        <span aria-hidden="true" className={buttonArrowClassName({ intent, size })}>
          <ArrowRight className={buttonArrowIconClassName} />
        </span>
      )}
    </Link>
  )
}
