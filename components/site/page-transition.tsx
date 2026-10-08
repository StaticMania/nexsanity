'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/animation/register-gsap'

type PageTransitionProps = {
  label: string
  children: ReactNode
}

type CurtainParts = {
  curtain: HTMLDivElement
  slices: HTMLElement[]
  chars: Element[]
}

const sliceCount = 3
const failsafeMilliseconds = 5000

export function PageTransition({ label, children }: PageTransitionProps) {
  const pathname = usePathname()
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLParagraphElement>(null)
  const charsRef = useRef<Element[]>([])
  const isFirstRender = useRef(true)
  const isCovering = useRef(false)
  const failsafeTimer = useRef(0)

  useEffect(() => {
    const curtain = curtainRef.current
    const mark = markRef.current
    if (!curtain || !mark) return

    const split = SplitText.create(mark, {
      type: 'chars',
      charsClass: 'curtain-char',
      mask: 'chars',
      aria: 'none',
    })
    charsRef.current = split.chars
    gsap.set(split.chars, { yPercent: 110 })
    gsap.set(readCurtainParts(curtain, split.chars).slices, { yPercent: 100 })

    const handleClick = (event: MouseEvent) => {
      if (isCovering.current || prefersReducedMotion()) return
      const url = readInternalUrl(event)
      if (!url) return

      event.preventDefault()
      isCovering.current = true

      const parts = readCurtainParts(curtain, split.chars)
      coverCurtain(parts).call(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`)
        failsafeTimer.current = window.setTimeout(() => {
          revealCurtain(parts, () => {
            isCovering.current = false
          })
        }, failsafeMilliseconds)
      })
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      window.clearTimeout(failsafeTimer.current)
      document.removeEventListener('click', handleClick, true)
      split.revert()
      charsRef.current = []
    }
  }, [router, label])

  useGSAP(
    () => {
      const content = contentRef.current
      const curtain = curtainRef.current
      if (!content || !curtain) return

      window.clearTimeout(failsafeTimer.current)

      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }

      if (prefersReducedMotion()) {
        isCovering.current = false
        gsap.set(curtain, { visibility: 'hidden' })
        return
      }

      window.scrollTo(0, 0)
      ScrollTrigger.refresh()

      revealCurtain(readCurtainParts(curtain, charsRef.current), () => {
        isCovering.current = false
      }).fromTo(
        content,
        { y: 80 },
        { y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' },
        0.5,
      )
    },
    { dependencies: [pathname] },
  )

  return (
    <>
      <div ref={contentRef}>{children}</div>
      <div
        ref={curtainRef}
        aria-hidden="true"
        data-lenis-prevent
        className="@container invisible fixed inset-0 z-50 overflow-hidden"
      >
        {Array.from({ length: sliceCount }, (_, index) => (
          <div
            key={index}
            data-curtain-slice
            className="absolute inset-y-0 w-[calc(100%/3+1px)] bg-inverse"
            style={{ left: `${(index * 100) / sliceCount}%` }}
          />
        ))}
        <div className="absolute inset-0 grid place-items-center">
          <p
            ref={markRef}
            className="curtain-wordmark pb-2 preloader-wordmark font-bold whitespace-nowrap text-inverse-ink uppercase"
          >
            {label}
          </p>
        </div>
      </div>
    </>
  )
}

function readCurtainParts(curtain: HTMLDivElement, chars: Element[]): CurtainParts {
  return {
    curtain,
    slices: Array.from(curtain.querySelectorAll<HTMLElement>('[data-curtain-slice]')),
    chars,
  }
}

function coverCurtain({ curtain, slices, chars }: CurtainParts) {
  return gsap
    .timeline()
    .set(curtain, { visibility: 'visible' })
    .fromTo(
      slices,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.7, ease: 'power3.inOut', stagger: 0.12 },
    )
    .fromTo(
      chars,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.04 },
      0.45,
    )
}

function revealCurtain({ curtain, slices, chars }: CurtainParts, onDone: () => void) {
  return gsap
    .timeline({
      onComplete: () => {
        gsap.set(curtain, { visibility: 'hidden' })
        onDone()
      },
    })
    .set(curtain, { visibility: 'visible' })
    .set(slices, { yPercent: 0 })
    .fromTo(
      chars,
      { yPercent: 0 },
      { yPercent: -110, duration: 0.5, ease: 'power3.in', stagger: 0.03 },
      0.1,
    )
    .to(slices, { yPercent: -100, duration: 0.8, ease: 'power3.inOut', stagger: 0.12 }, 0.4)
}

function readInternalUrl(event: MouseEvent): URL | null {
  if (event.defaultPrevented || event.button !== 0) return null
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  if (!(event.target instanceof Element)) return null

  const anchor = event.target.closest('a')
  if (!anchor || anchor.hasAttribute('download')) return null
  if (anchor.target && anchor.target !== '_self') return null

  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  if (url.pathname === window.location.pathname) return null
  if (url.pathname.startsWith('/studio') || url.pathname.startsWith('/api')) return null

  return url
}
