'use client'

import Image from 'next/image'
import { useRef } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { gsap, useGSAP } from '@/lib/animation/register-gsap'
import { cn } from '@/lib/cn'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

export type CycleLogo = {
  key: string
  name: string
  logo: SanityImageProps
}

type LogoCycleProps = {
  logos: readonly CycleLogo[]
  visibleCount?: number
  intervalSeconds?: number
  isOnDark?: boolean
}

const swapDurationSeconds = 0.6
const swapStaggerSeconds = 0.14
const swapOffsetPixels = 40
const swapBlur = 'blur(4px)'

export function LogoCycle({
  logos,
  visibleCount = 3,
  intervalSeconds = 2.8,
  isOnDark = false,
}: LogoCycleProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const groups = chunkLogos(logos, Math.max(1, visibleCount))
  const isCycling = groups.length > 1

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || !isCycling) return

      const groupElements = Array.from(root.querySelectorAll<HTMLElement>('[data-logo-group]'))
      const itemGroups = groupElements.map((group) =>
        Array.from(group.querySelectorAll<HTMLElement>('[data-logo-item]')),
      )

      groupElements.forEach((group, index) => {
        const isFirst = index === 0
        gsap.set(group, { autoAlpha: isFirst ? 1 : 0 })
        gsap.set(itemGroups[index] ?? [], {
          autoAlpha: isFirst ? 1 : 0,
          y: isFirst ? 0 : swapOffsetPixels,
          filter: isFirst ? 'none' : swapBlur,
        })
      })

      if (prefersReducedMotion()) return

      let currentIndex = 0
      let loopCall: gsap.core.Tween | undefined
      const activeTweens: gsap.core.Tween[] = []

      const swap = () => {
        const nextIndex = (currentIndex + 1) % groupElements.length
        const currentGroup = groupElements[currentIndex]
        const nextGroup = groupElements[nextIndex]
        const currentItems = itemGroups[currentIndex] ?? []
        const nextItems = itemGroups[nextIndex] ?? []
        if (!currentGroup || !nextGroup) return

        gsap.set(nextGroup, { autoAlpha: 1 })
        activeTweens.length = 0
        activeTweens.push(
          gsap.to(currentItems, {
            y: -swapOffsetPixels,
            autoAlpha: 0,
            filter: swapBlur,
            duration: swapDurationSeconds,
            stagger: swapStaggerSeconds,
            ease: 'power1.inOut',
          }),
          gsap.fromTo(
            nextItems,
            { y: swapOffsetPixels, autoAlpha: 0, filter: swapBlur },
            {
              y: 0,
              autoAlpha: 1,
              filter: 'none',
              duration: swapDurationSeconds,
              stagger: swapStaggerSeconds,
              ease: 'power1.inOut',
              onComplete: () => {
                gsap.set(currentGroup, { autoAlpha: 0 })
              },
            },
          ),
        )
        currentIndex = nextIndex
      }

      const schedule = (waitSeconds: number) => {
        loopCall = gsap.delayedCall(waitSeconds, () => {
          swap()
          schedule(intervalSeconds)
        })
      }
      schedule(intervalSeconds)

      const handlePointerEnter = () => {
        loopCall?.pause()
        activeTweens.forEach((tween) => tween.pause())
      }
      const handlePointerLeave = () => {
        loopCall?.resume()
        activeTweens.forEach((tween) => tween.resume())
      }
      root.addEventListener('pointerenter', handlePointerEnter)
      root.addEventListener('pointerleave', handlePointerLeave)

      return () => {
        loopCall?.kill()
        root.removeEventListener('pointerenter', handlePointerEnter)
        root.removeEventListener('pointerleave', handlePointerLeave)
      }
    },
    { scope: rootRef, dependencies: [isCycling, intervalSeconds, logos.length, visibleCount] },
  )

  const logoClassName = cn('h-8 w-auto object-contain opacity-75', isOnDark && 'invert')

  return (
    <div ref={rootRef} aria-hidden="true" className="grid w-full place-items-center py-10">
      {groups.map((group, groupIndex) => (
        <ul
          key={group.map((logo) => logo.key).join('-')}
          data-logo-group
          className={cn(
            'col-start-1 row-start-1 flex flex-wrap items-center justify-center gap-x-16 gap-y-6',
            groupIndex > 0 && 'invisible',
          )}
        >
          {group.map(({ key, logo }) => (
            <li key={key} data-logo-item>
              <Image
                src={logo.src}
                width={logo.width}
                height={logo.height}
                alt=""
                sizes="160px"
                className={logoClassName}
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

function chunkLogos(logos: readonly CycleLogo[], size: number): CycleLogo[][] {
  return Array.from({ length: Math.ceil(logos.length / size) }, (_, groupIndex) =>
    logos.slice(groupIndex * size, groupIndex * size + size),
  )
}
