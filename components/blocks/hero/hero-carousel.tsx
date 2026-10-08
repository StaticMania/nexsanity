'use client'

import Image from 'next/image'
import { useRef } from 'react'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/animation/register-gsap'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

export type CarouselImage = SanityImageProps & { key: string }

type RingCard = CarouselImage & { ringKey: string; isOriginal: boolean }

type HeroCarouselProps = {
  images: readonly CarouselImage[]
  hasAutoScroll: boolean
}

const minimumRingCards = 12
const cardSpacing = 1.1
const cameraPullbackRatio = 0.44
const maximumCardScale = 3
const edgeBleedPixels = 48
const fadeStartRatio = 0.7
const maximumFade = 0.35
const autoSpinDegreesPerFrame = 0.07
const dragDegreesPerPixel = 0.14
const scrollSpinCards = 3
const easing = 0.08

export function HeroCarousel({ images, hasAutoScroll }: HeroCarouselProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLUListElement>(null)
  const ringCards = buildRingCards(images, minimumRingCards)

  useGSAP(
    () => {
      const stage = stageRef.current
      const ring = ringRef.current
      if (!stage || !ring) return

      const cards = gsap.utils.toArray<HTMLElement>('[data-ring-card]', ring)
      const fades = cards.map((card) => card.querySelector<HTMLElement>('[data-ring-fade]'))
      const step = 360 / cards.length
      const isMotionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const motion = { auto: 0, drag: 0, scroll: 0, current: 0, speed: 0 }
      let radius = 0
      let cameraDepth = 0
      let perspective = 1
      let stageHalfWidth = 0
      let cardHalfWidth = 0
      let isDragging = false
      let pointerX = 0
      let pointerVelocity = 0

      const layout = () => {
        const cardWidth = cards[0]?.offsetWidth ?? 0
        radius = (cardWidth / 2 / Math.tan(((step / 2) * Math.PI) / 180)) * cardSpacing
        cameraDepth = radius * (1 - cameraPullbackRatio)
        perspective = Number.parseFloat(getComputedStyle(stage).perspective) || 1000
        stageHalfWidth = stage.clientWidth / 2
        cardHalfWidth = cardWidth / 2
        cards.forEach((card, index) => {
          card.style.transform = `translate(-50%, -50%) rotateY(${-index * step}deg) translateZ(${-radius}px)`
        })
      }

      const angleOf = (index: number) =>
        ((((-index * step + motion.current) % 360) + 540) % 360) - 180

      const render = () => {
        const target = motion.auto + motion.drag + motion.scroll
        motion.current += (target - motion.current) * (isMotionAllowed ? easing : 1)
        ring.style.transform = `translateZ(${cameraDepth}px) rotateY(${motion.current}deg)`
        cards.forEach((card, index) => {
          const angle = (angleOf(index) * Math.PI) / 180
          const depth = cameraDepth - radius * Math.cos(angle)
          const isInFrontOfCamera = depth < perspective * (1 - 1 / maximumCardScale)
          const scale = perspective / (perspective - depth)
          const screenX = Math.abs(radius * Math.sin(angle)) * scale
          const isOnStage = screenX - cardHalfWidth * scale < stageHalfWidth + edgeBleedPixels
          card.style.visibility = isInFrontOfCamera && isOnStage ? 'visible' : 'hidden'
          const fade = fades[index]
          if (fade) {
            const edgeProgress = (screenX / stageHalfWidth - fadeStartRatio) / (1 - fadeStartRatio)
            fade.style.opacity = String(Math.min(1, Math.max(0, edgeProgress)) * maximumFade)
          }
        })
      }

      const handleTick = () => {
        motion.auto -= motion.speed * autoSpinDegreesPerFrame * gsap.ticker.deltaRatio()
        render()
      }

      const handlePointerDown = (event: PointerEvent) => {
        isDragging = true
        pointerX = event.clientX
        pointerVelocity = 0
        gsap.killTweensOf(motion, 'drag')
        stage.setPointerCapture(event.pointerId)
      }

      const handlePointerMove = (event: PointerEvent) => {
        if (!isDragging) return
        const deltaX = event.clientX - pointerX
        pointerX = event.clientX
        pointerVelocity = deltaX
        motion.drag -= deltaX * dragDegreesPerPixel
      }

      const handlePointerUp = (event: PointerEvent) => {
        if (!isDragging) return
        isDragging = false
        stage.releasePointerCapture(event.pointerId)
        gsap.to(motion, {
          drag: motion.drag - pointerVelocity * dragDegreesPerPixel * 14,
          duration: isMotionAllowed ? 1.4 : 0,
          ease: 'expo.out',
        })
      }

      const handlePointerEnter = () => gsap.to(motion, { speed: 0.2, duration: 0.8 })
      const handlePointerLeave = () => gsap.to(motion, { speed: 1, duration: 0.8 })

      layout()
      render()
      gsap.to(cards, {
        opacity: 1,
        duration: isMotionAllowed ? 0.8 : 0,
        ease: 'power2.out',
        stagger: isMotionAllowed ? 0.03 : 0,
      })

      const resizeObserver = new ResizeObserver(() => {
        layout()
        render()
      })
      resizeObserver.observe(stage)

      stage.addEventListener('pointerdown', handlePointerDown)
      stage.addEventListener('pointermove', handlePointerMove)
      stage.addEventListener('pointerup', handlePointerUp)
      stage.addEventListener('pointercancel', handlePointerUp)

      if (isMotionAllowed && hasAutoScroll) {
        motion.speed = 1
        stage.addEventListener('pointerenter', handlePointerEnter)
        stage.addEventListener('pointerleave', handlePointerLeave)
      }

      const startProgress = { value: 0 }
      const scrollTrigger = ScrollTrigger.create({
        trigger: stage,
        start: 'top bottom',
        end: 'bottom top',
        onRefresh: (self) => {
          startProgress.value = self.progress
        },
        onUpdate: (self) => {
          if (!isMotionAllowed) return
          motion.scroll = -(self.progress - startProgress.value) * step * scrollSpinCards
        },
        onToggle: (self) => {
          if (self.isActive) gsap.ticker.add(handleTick)
          else gsap.ticker.remove(handleTick)
        },
      })
      startProgress.value = scrollTrigger.progress
      if (scrollTrigger.isActive) gsap.ticker.add(handleTick)

      return () => {
        gsap.ticker.remove(handleTick)
        gsap.killTweensOf(motion)
        scrollTrigger.kill()
        resizeObserver.disconnect()
        stage.removeEventListener('pointerdown', handlePointerDown)
        stage.removeEventListener('pointermove', handlePointerMove)
        stage.removeEventListener('pointerup', handlePointerUp)
        stage.removeEventListener('pointercancel', handlePointerUp)
        stage.removeEventListener('pointerenter', handlePointerEnter)
        stage.removeEventListener('pointerleave', handlePointerLeave)
      }
    },
    { scope: stageRef, dependencies: [hasAutoScroll, ringCards.length] },
  )

  return (
    <div
      ref={stageRef}
      className="relative h-56 cursor-grab touch-pan-y ring-overflow select-none perspective-ring active:cursor-grabbing sm:h-64 lg:h-72"
    >
      <ul ref={ringRef} className="absolute top-1/2 left-1/2 transform-3d">
        {ringCards.map((card) => (
          <li
            key={card.ringKey}
            data-ring-card
            aria-hidden={card.isOriginal ? undefined : true}
            className="absolute top-0 left-0 aspect-3/4 w-36 overflow-hidden rounded-card bg-surface opacity-0 backface-hidden sm:w-44 lg:w-52"
          >
            <Image
              src={card.src}
              width={card.width}
              height={card.height}
              alt={card.isOriginal ? card.alt : ''}
              placeholder={card.placeholder}
              blurDataURL={card.blurDataURL}
              draggable={false}
              sizes="(min-width: 1024px) 13rem, (min-width: 640px) 11rem, 9rem"
              loading={card.isOriginal ? 'eager' : 'lazy'}
              className="size-full object-cover"
            />
            <span
              data-ring-fade
              className="pointer-events-none absolute inset-0 bg-canvas opacity-0"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function buildRingCards(images: readonly CarouselImage[], minimumLength: number): RingCard[] {
  if (images.length === 0) return []
  const repeatCount = Math.ceil(minimumLength / images.length)
  return Array.from({ length: repeatCount }, (_, repeat) =>
    images.map((image) => ({
      ...image,
      ringKey: `${image.key}-${repeat}`,
      isOriginal: repeat === 0,
    })),
  ).flat()
}
