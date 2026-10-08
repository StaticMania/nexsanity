'use client'

import Image from 'next/image'
import { useRef } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, useGSAP } from '@/lib/animation/register-gsap'
import type { DriftTestimonial } from '@/lib/content/build-drift-columns'

type ColumnDriftProps = {
  columns: readonly DriftTestimonial[][]
}

const columnEntry = [
  { x: -90, y: 28, rotation: -5 },
  { x: 0, y: 56, rotation: 0 },
  { x: 90, y: 28, rotation: 5 },
]

const narrowEntry = { x: 0, y: 56, rotation: 0 }

const columnDrift = [48, -28, -48]

export function ColumnDrift({ columns }: ColumnDriftProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || prefersReducedMotion()) return

      const columnElements = Array.from(root.querySelectorAll<HTMLElement>('[data-drift-column]'))
      const media = gsap.matchMedia()

      media.add({ isWide: '(min-width: 64rem)', isNarrow: '(max-width: 63.999rem)' }, (context) => {
        const isWide = Boolean(context.conditions?.isWide)

        columnElements.forEach((column, index) => {
          const entry = isWide ? (columnEntry[index] ?? narrowEntry) : narrowEntry
          gsap.set(Array.from(column.children), { opacity: 0, ...entry })
        })

        const settle = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        })

        columnElements.forEach((column, index) => {
          settle.to(
            Array.from(column.children),
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.14,
            },
            index === 1 ? 0.18 : index * 0.06,
          )
        })

        if (!isWide) return

        columnElements.forEach((column, index) => {
          gsap.to(column, {
            y: columnDrift[index] ?? 0,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          })
        })
      })

      return () => media.revert()
    },
    { scope: rootRef, dependencies: [columns] },
  )

  return (
    <div ref={rootRef} className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
      {columns.map((column) => (
        <ul
          key={column.map((testimonial) => testimonial.key).join('-')}
          data-drift-column
          className="flex flex-col gap-6"
        >
          {column.map((testimonial) => (
            <TestimonialCard key={testimonial.key} testimonial={testimonial} />
          ))}
        </ul>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: DriftTestimonial }) {
  const cardRef = useRef<HTMLLIElement>(null)
  const avatarRef = useRef<HTMLSpanElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)

  const handlePointerEnter = () => {
    if (prefersReducedMotion()) return
    gsap.to(cardRef.current, { y: -10, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    gsap.fromTo(
      avatarRef.current,
      { rotationY: 0 },
      {
        rotationY: 18,
        duration: 0.35,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        overwrite: 'auto',
      },
    )
    gsap.to(highlightRef.current, {
      backgroundSize: '100% 2px',
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const handlePointerLeave = () => {
    if (prefersReducedMotion()) return
    gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    gsap.to(highlightRef.current, {
      backgroundSize: '0% 2px',
      duration: 0.3,
      ease: 'power2.in',
      overwrite: 'auto',
    })
  }

  return (
    <li
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="will-change-transform motion-reduce:transform-none"
    >
      <figure className="flex min-h-72 flex-col justify-between gap-10 rounded-panel bg-canvas p-7 text-ink ring-1 ring-line">
        <blockquote className="text-lg leading-relaxed text-pretty text-muted">
          <p>
            <span ref={highlightRef} className="highlight-underline text-ink">
              {testimonial.highlight}
            </span>
            {testimonial.remainder && ` ${testimonial.remainder}`}
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-3">
          {testimonial.avatar && (
            <span
              ref={avatarRef}
              className="flex size-14 shrink-0 items-center justify-center rounded-card bg-surface p-1 perspective-ring"
            >
              <Image
                src={testimonial.avatar.src}
                width={testimonial.avatar.width}
                height={testimonial.avatar.height}
                alt=""
                placeholder={testimonial.avatar.placeholder}
                blurDataURL={testimonial.avatar.blurDataURL}
                sizes="48px"
                className="size-12 rounded-lg object-cover"
              />
            </span>
          )}
          <span className="flex min-w-0 flex-col">
            <span className="font-medium">{testimonial.name}</span>
            {testimonial.role && <span className="text-sm text-muted">{testimonial.role}</span>}
          </span>
        </figcaption>
      </figure>
    </li>
  )
}
