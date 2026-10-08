'use client'

import Link from 'next/link'
import { useId, useRef } from 'react'
import type { ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/animation/register-gsap'
import { cn } from '@/lib/cn'
import type { NavigationItem } from '@/lib/content/build-navigation-items'
import { isExternalHref } from '@/lib/ui/is-external-href'

import { RollText } from '@/components/ui/roll-text'
import { SocialIcon } from '@/components/ui/social-icon'

export type FooterColumn = {
  key: string
  title: string
  items: readonly NavigationItem[]
}

export type FooterSocial = {
  key: string
  platform: string
  url: string
}

type FooterWordmarkRiseProps = {
  brand: string
  logo: ReactNode
  tagline: string | null
  columns: readonly FooterColumn[]
  socials: readonly FooterSocial[]
  legalItems: readonly NavigationItem[]
  copyright: string
}

const linkUnderlineClassName = cn(
  'after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-expo after:content-[""]',
  'hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100 motion-reduce:after:transition-none',
)

export function FooterWordmarkRise({
  brand,
  logo,
  tagline,
  columns,
  socials,
  legalItems,
  copyright,
}: FooterWordmarkRiseProps) {
  const rootRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLParagraphElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const box = boxRef.current
      const mark = markRef.current
      const word = wordRef.current
      if (!root || !box || !mark || !word) return

      const isReduced = prefersReducedMotion()
      let fittedWidth = 0

      const fitWordmark = () => {
        const width = box.clientWidth
        if (!width || width === fittedWidth) return
        fittedWidth = width
        mark.style.fontSize = ''
        const fontSize = Number.parseFloat(getComputedStyle(mark).fontSize)
        const trailing = Number.parseFloat(getComputedStyle(word).letterSpacing) || 0
        const inkWidth = word.offsetWidth - trailing
        if (inkWidth > 0) mark.style.fontSize = `${(fontSize * width) / inkWidth}px`
      }

      const resizeObserver = new ResizeObserver(fitWordmark)
      resizeObserver.observe(box)
      fitWordmark()

      const entrance = isReduced
        ? null
        : gsap
            .timeline({
              scrollTrigger: {
                trigger: root,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            })
            .fromTo(
              root.querySelectorAll('[data-footer-glow]'),
              { autoAlpha: 0, scaleY: 0.35 },
              { autoAlpha: 1, scaleY: 1, duration: 1.6, ease: 'power2.out' },
              0,
            )
            .fromTo(
              root.querySelectorAll('[data-footer-rise]'),
              { autoAlpha: 0, y: 48 },
              { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.18 },
              0.1,
            )

      if (!isReduced) gsap.set(word, { autoAlpha: 0 })

      let split: SplitText | null = null
      let reveal: gsap.core.Tween | null = null
      let isMounted = true

      const revealWordmark = () => {
        split = SplitText.create(word, {
          type: 'chars',
          charsClass: 'wordmark-char',
          mask: 'chars',
          aria: 'none',
        })
        mark.dataset.split = ''
        reveal = gsap.fromTo(
          split.chars,
          { yPercent: 105 },
          {
            yPercent: 0,
            duration: 1.6,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: box,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          },
        )
        gsap.set(word, { autoAlpha: 1 })
      }

      const setup = () => {
        if (!isMounted) return
        fittedWidth = 0
        fitWordmark()
        if (isReduced) return
        revealWordmark()
        fittedWidth = 0
        fitWordmark()
        ScrollTrigger.refresh()
      }

      const fontsReady = document.fonts.ready
      const timeout = new Promise((resolve) => setTimeout(resolve, 1500))
      void Promise.race([fontsReady, timeout]).then(setup)

      return () => {
        isMounted = false
        resizeObserver.disconnect()
        entrance?.scrollTrigger?.kill()
        entrance?.kill()
        reveal?.scrollTrigger?.kill()
        reveal?.kill()
        split?.revert()
        delete mark.dataset.split
        mark.style.fontSize = ''
      }
    },
    { scope: rootRef, dependencies: [brand] },
  )

  return (
    <footer
      ref={rootRef}
      className="relative isolate w-full overflow-hidden bg-inverse pt-20 pb-8 text-inverse-ink max-sm:pt-14"
    >
      <div
        aria-hidden="true"
        data-footer-glow
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-105 origin-bottom max-sm:h-75"
      >
        <span className="footer-glow-outer" />
        <span className="footer-glow-inner" />
      </div>

      <div className="main-container">
        <div className="grid gap-4 max-sm:gap-10">
          <div
            data-footer-rise
            className="flex flex-wrap items-start justify-between gap-12 max-md:flex-col max-md:gap-10"
          >
            <div className="grid w-75 justify-items-start gap-6 max-md:w-full">
              {logo}
              {tagline && <p className="leading-relaxed text-inverse-muted">{tagline}</p>}
              {socials.length > 0 && (
                <ul aria-label="Social media" className="flex gap-3">
                  {socials.map((social) => (
                    <li key={social.key}>
                      <Link
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${brand} on ${social.platform}`}
                        className="group/social flex size-11 items-center justify-center rounded-full border border-inverse-line text-inverse-ink/70 transition-[color,translate,border-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-inverse-muted hover:text-inverse-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        <SocialIcon platform={social.platform} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {columns.length > 0 && (
              <nav aria-label="Footer" className="flex flex-wrap gap-x-20 gap-y-10 max-lg:gap-x-12">
                {columns.map((column) => (
                  <FooterLinkGroup key={column.key} column={column} />
                ))}
              </nav>
            )}
          </div>

          <div ref={boxRef} className="min-w-0">
            <p
              ref={markRef}
              aria-hidden="true"
              className="pointer-events-none wordmark-fade pb-2 text-center text-wordmark font-bold whitespace-nowrap uppercase select-none"
            >
              <span ref={wordRef} className="inline-block">
                {brand}
              </span>
            </p>
          </div>

          <div
            data-footer-rise
            className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-inverse-line pt-6 max-sm:flex-col max-sm:items-start"
          >
            <p className="text-xs tracking-widest whitespace-nowrap text-inverse-muted uppercase">
              {copyright}
            </p>
            {legalItems.length > 0 && (
              <ul
                aria-label="Legal"
                className="flex flex-wrap items-center gap-x-8 gap-y-3 max-sm:gap-x-6"
              >
                {legalItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative inline-block text-xs tracking-widest whitespace-nowrap text-inverse-muted uppercase transition-colors duration-300 hover:text-inverse-ink',
                        linkUnderlineClassName,
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkGroup({ column }: { column: FooterColumn }) {
  const headingId = useId()

  return (
    <div className="grid content-start gap-4">
      <h2 id={headingId} className="text-xs tracking-widest text-inverse-muted uppercase">
        {column.title}
      </h2>
      <ul aria-labelledby={headingId} className="grid gap-3">
        {column.items.map((item) => {
          const isExternal = isExternalHref(item.href)
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={cn(
                  'group/roll relative inline-block whitespace-nowrap text-inverse-ink/85 transition-colors duration-300 hover:text-inverse-ink motion-reduce:transition-none',
                  linkUnderlineClassName,
                )}
              >
                <RollText>{item.label}</RollText>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
