'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/animation/register-gsap'
import { waitForPreloader } from '@/lib/animation/wait-for-preloader'

type AnimatedHeaderProps = {
  children: ReactNode
}

const scrolledOffsetPixels = 24
const hideAfterPixels = 160

export function AnimatedHeader({ children }: AnimatedHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const header = headerRef.current
      if (!header) return

      const isReduced = prefersReducedMotion()
      const items = header.querySelectorAll('[data-header-item]')
      let isHidden = false
      let isMounted = true

      if (!isReduced) gsap.set(items, { autoAlpha: 0, y: -16 })

      void waitForPreloader().then(() => {
        if (!isMounted || isReduced) return
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 })
      })

      const visibility = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const scrollTop = self.scroll()
          header.toggleAttribute('data-scrolled', scrollTop > scrolledOffsetPixels)
          const shouldHide = self.direction === 1 && scrollTop > hideAfterPixels
          if (shouldHide === isHidden) return
          isHidden = shouldHide
          gsap.to(header, {
            yPercent: shouldHide ? -100 : 0,
            duration: isReduced ? 0 : 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        },
      })

      return () => {
        isMounted = false
        visibility.kill()
      }
    },
    { scope: headerRef },
  )

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md transition-[background-color,box-shadow] duration-300 data-scrolled:bg-canvas/95 data-scrolled:shadow-sm"
    >
      {children}
    </header>
  )
}
