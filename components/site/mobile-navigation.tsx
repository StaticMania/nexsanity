'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useId, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/cn'
import type { CtaItem } from '@/lib/content/build-cta-items'
import type { NavigationItem } from '@/lib/content/build-navigation-items'
import { buttonClassName } from '@/lib/ui/button-class-name'

import { NavigationLink } from '@/components/site/navigation-link'

type MobileNavigationProps = {
  items: readonly NavigationItem[]
  cta: CtaItem | null
}

export function MobileNavigation({ items, cta }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const portalTarget = useSyncExternalStore(subscribeToNothing, readPortalTarget, readNoTarget)
  const panelId = useId()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  useEffect(() => {
    if (!isOpen) return

    const html = document.documentElement
    html.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      html.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const panel = (
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!isOpen}
      data-lenis-prevent
      className={cn(
        'fixed inset-0 z-45 flex flex-col overflow-y-auto bg-canvas text-ink transition-[translate,visibility] duration-700 ease-out-expo motion-reduce:transition-none lg:hidden',
        isOpen ? 'visible translate-x-0' : 'invisible translate-x-full',
      )}
    >
      <div className="main-container flex h-20 shrink-0 items-center justify-between">
        <Link href="/" onClick={handleClose} aria-label="Home" className="inline-flex">
          <Image
            src="/brand/mark-on-light.webp"
            alt=""
            width={160}
            height={160}
            className="size-10 theme-dark:hidden"
          />
          <Image
            src="/brand/mark-on-dark.webp"
            alt=""
            width={160}
            height={160}
            className="hidden size-10 theme-dark:block"
          />
        </Link>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close menu"
          className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <nav aria-label="Mobile" className="main-container flex flex-1 flex-col pt-6 pb-10">
        <ul className="flex flex-col">
          {items.map((item, index) => (
            <li
              key={item.key}
              style={{ transitionDelay: isOpen ? `${150 + index * 60}ms` : '0ms' }}
              className={cn(
                'border-b border-line transition-[opacity,translate] duration-700 ease-out-expo motion-reduce:transition-none',
                isOpen ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0',
              )}
            >
              <NavigationLink
                href={item.href}
                onNavigate={handleClose}
                className="block py-5 text-4xl font-medium tracking-tight"
                activeClassName="text-accent"
              >
                {item.label}
              </NavigationLink>
            </li>
          ))}
        </ul>
        {cta && (
          <NavigationLink
            href={cta.href}
            onNavigate={handleClose}
            className={buttonClassName({ size: 'large', className: 'mt-auto w-full' })}
          >
            {cta.label}
          </NavigationLink>
        )}
      </nav>
    </div>
  )

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label="Open menu"
        className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>
      {portalTarget && createPortal(panel, portalTarget)}
    </div>
  )
}

function subscribeToNothing() {
  return () => {}
}

function readPortalTarget(): HTMLElement {
  return document.querySelector<HTMLElement>('[data-site-root]') ?? document.body
}

function readNoTarget(): HTMLElement | null {
  return null
}
