'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'

import { gsap, useGSAP } from '@/lib/animation/register-gsap'

type RevealGroupProps = {
  children: ReactNode
  className?: string
}

export function RevealGroup({ children, className }: RevealGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mediaQueries = gsap.matchMedia()
      mediaQueries.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-reveal]', {
          y: 48,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: containerRef.current, start: 'top 95%', once: true },
        })
      })
      return () => mediaQueries.revert()
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
