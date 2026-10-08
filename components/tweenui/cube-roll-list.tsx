'use client'

import Link from 'next/link'
import { useRef } from 'react'
import type { FocusEvent, MouseEvent } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, useGSAP } from '@/lib/animation/register-gsap'
import { cn } from '@/lib/cn'

export type CubeRollEntry = {
  key: string
  title: string
  label: string | null
  href: string
}

type CubeRollListProps = {
  entries: readonly CubeRollEntry[]
  label: string
}

type FaceSide = 'front' | 'back' | 'top' | 'bottom'

const faceSides: readonly FaceSide[] = ['front', 'back', 'top', 'bottom']

const faceClassNames = {
  front: 'roll-face-front',
  back: 'roll-face-back',
  top: 'roll-face-top',
  bottom: 'roll-face-bottom',
} as const satisfies Record<FaceSide, string>

const rollEase = 'back.out(1.6)'

export function CubeRollList({ entries, label }: CubeRollListProps) {
  const rootRef = useRef<HTMLElement>(null)
  const anglesRef = useRef<number[]>([])
  const activeRowsRef = useRef<boolean[]>([])

  useGSAP(
    () => {
      anglesRef.current = entries.map(() => 0)
      activeRowsRef.current = entries.map(() => false)
      if (prefersReducedMotion()) return

      const hiddenBackContent = '[data-roll-face="back"] > *'
      gsap.set('[data-roll-rule]', { scaleX: 0 })
      gsap.set('[data-roll-drum]', { rotationX: 180 })
      gsap.set(hiddenBackContent, { opacity: 0 })

      gsap
        .timeline({
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
          onComplete: () => {
            gsap.set(hiddenBackContent, { opacity: 1 })
          },
        })
        .to('[data-roll-rule]', { scaleX: 1, duration: 0.9, ease: 'expo.inOut', stagger: 0.15 }, 0)
        .to(
          '[data-roll-drum]',
          { rotationX: 0, duration: 0.9, ease: 'power4.inOut', stagger: 0.15 },
          0.15,
        )
    },
    { scope: rootRef, dependencies: [entries] },
  )

  const turnRow = (link: HTMLElement, index: number, isActive: boolean, isDownward: boolean) => {
    if (activeRowsRef.current[index] === isActive) return
    activeRowsRef.current[index] = isActive
    const drum = link.querySelector('[data-roll-drum]')
    if (!drum) return
    gsap.set(link.querySelectorAll('[data-roll-face="back"] > *'), { opacity: 1 })

    if (prefersReducedMotion()) {
      anglesRef.current[index] = isActive ? -90 : 0
      gsap.set(drum, { rotationX: anglesRef.current[index] })
      return
    }

    anglesRef.current[index] = (anglesRef.current[index] ?? 0) + (isDownward ? -90 : 90)
    gsap.to(drum, {
      rotationX: anglesRef.current[index],
      duration: isActive ? 0.6 : 0.7,
      ease: rollEase,
      overwrite: 'auto',
    })
  }

  const handlePointerEnter = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (!canHover()) return
    turnRow(event.currentTarget, index, true, isFromTop(event))
  }

  const handlePointerLeave = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (!canHover()) return
    turnRow(event.currentTarget, index, false, !isFromTop(event))
  }

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>, index: number) => {
    if (event.currentTarget.matches(':focus-visible'))
      turnRow(event.currentTarget, index, true, true)
  }

  return (
    <nav ref={rootRef} aria-label={label}>
      <ul className="flex flex-col">
        {entries.map((entry, index) => {
          const number = String(index + 1).padStart(3, '0')
          return (
            <li key={entry.key} className="relative roll-row overflow-y-clip">
              <span
                data-roll-rule
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left bg-ink/20"
              />
              <Link
                href={entry.href}
                onMouseEnter={(event) => handlePointerEnter(event, index)}
                onMouseLeave={(event) => handlePointerLeave(event, index)}
                onFocus={(event) => handleFocus(event, index)}
                onBlur={(event) => turnRow(event.currentTarget, index, false, true)}
                className="block size-full perspective-drum"
              >
                <span className="relative block size-full roll-origin">
                  <span
                    data-roll-drum
                    className="absolute inset-0 block will-change-transform transform-3d motion-reduce:will-change-auto"
                  >
                    {faceSides.map((side) => (
                      <RollFace key={side} side={side} entry={entry} number={number} />
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <span data-roll-rule aria-hidden="true" className="block h-px origin-left bg-ink/20" />
    </nav>
  )
}

function RollFace({
  side,
  entry,
  number,
}: {
  side: FaceSide
  entry: CubeRollEntry
  number: string
}) {
  const isFilled = side === 'top' || side === 'bottom'

  return (
    <span
      data-roll-face={side}
      aria-hidden={side === 'front' ? undefined : true}
      className={cn(
        'absolute inset-0 block backface-hidden',
        faceClassNames[side],
        isFilled ? 'bg-ink text-canvas' : 'bg-canvas text-ink',
      )}
    >
      <span className="grid h-full grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3 px-3 md:grid-cols-4 md:gap-6 md:px-4">
        <span className={cn('text-xs tabular-nums', isFilled ? 'text-tan' : 'text-accent')}>
          {number}
        </span>
        <span className="min-w-0 truncate text-center font-serif text-2xl leading-snug sm:text-3xl md:col-span-2 md:text-4xl">
          {entry.title}
        </span>
        {entry.label && (
          <span
            className={cn(
              'hidden text-right text-sm md:block',
              isFilled ? 'text-canvas/75' : 'text-muted',
            )}
          >
            {entry.label}
          </span>
        )}
      </span>
    </span>
  )
}

function canHover(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function isFromTop(event: MouseEvent<HTMLElement>): boolean {
  const bounds = event.currentTarget.getBoundingClientRect()
  return event.clientY < bounds.top + bounds.height / 2
}
