'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, SplitText, useGSAP } from '@/lib/animation/register-gsap'
import { waitForPreloader } from '@/lib/animation/wait-for-preloader'

type HeroIntroProps = {
  children: ReactNode
  className?: string
}

export function HeroIntro({ children, className }: HeroIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion() || root.dataset.intro === 'played') return

      const splits: SplitText[] = []
      let timeline: gsap.core.Timeline | null = null
      let isMounted = true
      gsap.set(root, { autoAlpha: 0 })

      const play = () => {
        if (!isMounted) return
        root.dataset.intro = 'played'
        const lineGroups = Array.from(root.querySelectorAll<HTMLElement>('[data-intro-lines]')).map(
          (element) => {
            const split = SplitText.create(element, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'pb-3 -mb-3',
            })
            splits.push(split)
            return split.lines
          },
        )
        const buttons = root.querySelectorAll('[data-intro-ctas] li')

        gsap.set(root, { autoAlpha: 1 })
        timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })
        lineGroups.forEach((lines, index) => {
          timeline?.from(
            lines,
            { yPercent: 110, duration: 1.2, stagger: 0.09 },
            index === 0 ? 0 : '-=0.9',
          )
        })
        timeline.from(buttons, { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, '-=0.8')
        const risers = root.querySelectorAll('[data-intro-rise]')
        if (risers.length > 0) {
          timeline.from(risers, { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, '-=0.7')
        }
      }

      void Promise.all([document.fonts.ready, waitForPreloader()]).then(play)

      return () => {
        isMounted = false
        timeline?.revert()
        splits.forEach((split) => split.revert())
        gsap.set(root, { clearProps: 'opacity,visibility' })
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  )
}
