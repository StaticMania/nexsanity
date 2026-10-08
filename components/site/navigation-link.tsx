'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type NavigationLinkProps = {
  href: string
  className?: string
  activeClassName?: string
  onNavigate?: () => void
  children: ReactNode
}

export function NavigationLink({
  href,
  className,
  activeClassName,
  onNavigate,
  children,
}: NavigationLinkProps) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  )
}
