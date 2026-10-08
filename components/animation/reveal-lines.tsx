'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'

import { gsap, SplitText, useGSAP } from '@/lib/animation/register-gsap'

type RevealLinesProps = {
  children: ReactNode
  delay?: number
}

export function RevealLines({ children, delay = 0 }: RevealLinesProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mediaQueries = gsap.matchMedia()
      mediaQueries.add('(prefers-reduced-motion: no-preference)', () => {
        if (!containerRef.current) return
        const split = SplitText.create(containerRef.current, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'pb-3 -mb-3',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              delay,
              ease: 'expo.out',
              stagger: 0.09,
            }),
        })
        return () => split.revert()
      })
      return () => mediaQueries.revert()
    },
    { scope: containerRef },
  )

  return (
    <span ref={containerRef} className="block">
      {children}
    </span>
  )
}
