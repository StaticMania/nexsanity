'use client'

import { useId, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, SplitText, useGSAP } from '@/lib/animation/register-gsap'
import type { SubheadingLevel } from '@/lib/content/heading-levels'

export type FaqAccordionItem = {
  key: string
  question: string
  answer: string
}

type FaqAccordionProps = {
  items: readonly FaqAccordionItem[]
  headingLevel: SubheadingLevel
  defaultOpenIndex?: number | null
}

export function FaqAccordion({
  items,
  headingLevel: HeadingTag,
  defaultOpenIndex = 0,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)
  const rootRef = useRef<HTMLDivElement>(null)
  const isFirstRunRef = useRef(true)
  const accordionId = useId()

  const handleToggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index))

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const isReduced = prefersReducedMotion()
      const isFirstRun = isFirstRunRef.current
      isFirstRunRef.current = false
      const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-faq-panel]'))
      const splits: SplitText[] = []

      const splitAnswer = (panel: HTMLElement) => {
        const text = panel.querySelector<HTMLElement>('[data-faq-text]')
        if (!text) return null
        const split = SplitText.create(text, { type: 'lines', mask: 'lines' })
        splits.push(split)
        return split
      }

      panels.forEach((panel, index) => {
        const isOpen = index === openIndex
        gsap.killTweensOf(panel)

        if (isFirstRun || isReduced) {
          panel.style.height = isOpen ? 'auto' : '0px'
          return
        }

        const split = splitAnswer(panel)

        if (isOpen) {
          gsap.set(panel, { height: 'auto' })
          const targetHeight = panel.offsetHeight
          gsap.fromTo(
            panel,
            { height: 0 },
            {
              height: targetHeight,
              duration: 0.6,
              ease: 'accordion-ease',
              onComplete: () => {
                panel.style.height = 'auto'
              },
            },
          )
          if (split) {
            gsap.fromTo(
              split.lines,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 0.65,
                stagger: 0.06,
                ease: 'power3.out',
                onComplete: () => split.revert(),
              },
            )
          }
          return
        }

        if (split) {
          gsap.to(split.lines, {
            yPercent: 110,
            duration: 0.45,
            stagger: 0.04,
            ease: 'power3.out',
            onComplete: () => split.revert(),
          })
        }
        gsap.to(panel, { height: 0, duration: 0.6, ease: 'accordion-ease' })
      })

      return () => {
        splits.forEach((split) => split.revert())
      }
    },
    { scope: rootRef, dependencies: [openIndex] },
  )

  return (
    <div ref={rootRef} className="w-full space-y-3">
      {items.map((item, index) => {
        const isOpen = index === openIndex
        const triggerId = `${accordionId}-trigger-${item.key}`
        const panelId = `${accordionId}-panel-${item.key}`

        return (
          <div key={item.key} className="overflow-hidden rounded-card bg-canvas ring-1 ring-line">
            <HeadingTag>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(index)}
                className="group flex w-full cursor-pointer items-start justify-between gap-x-4 px-6 py-5 text-left text-lg font-medium text-ink"
              >
                <span className="flex-1 text-pretty">{item.question}</span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface text-ink">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 stroke-current"
                    fill="none"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  >
                    <path d="M4 12h16" strokeLinecap="round" />
                    <path
                      d="M12 4v16"
                      strokeLinecap="round"
                      className="origin-center transition-[opacity,rotate] duration-300 group-aria-expanded:rotate-90 group-aria-expanded:opacity-0 motion-reduce:transition-none"
                    />
                  </svg>
                </span>
              </button>
            </HeadingTag>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              data-faq-panel
              className="overflow-hidden"
            >
              <p data-faq-text className="px-6 pb-6 text-pretty text-muted">
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
