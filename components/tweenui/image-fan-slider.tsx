'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

export type FanImage = SanityImageProps & { key: string }

type ImageFanSliderProps = {
  images: readonly FanImage[]
  intervalSeconds?: number
}

export function ImageFanSlider({ images, intervalSeconds = 2.5 }: ImageFanSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const total = images.length

  useEffect(() => {
    if (total <= 1 || isPaused || prefersReducedMotion()) return
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, intervalSeconds * 1000)
    return () => window.clearInterval(intervalId)
  }, [intervalSeconds, isPaused, total])

  return (
    <div
      aria-hidden="true"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      className="relative flex h-70 w-full items-start justify-center max-sm:scale-75"
    >
      {images.map((image, index) => (
        <figure
          key={image.key}
          style={buildSlideStyle(index, activeIndex, total)}
          className="absolute overflow-hidden border-4 border-canvas transition-all duration-700 ease-in-out motion-reduce:transition-none"
        >
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            placeholder={image.placeholder}
            blurDataURL={image.blurDataURL}
            sizes="200px"
            className="size-full rounded-lg object-cover"
          />
        </figure>
      ))}
    </div>
  )
}

function buildSlideStyle(slideIndex: number, activeIndex: number, total: number): CSSProperties {
  const offset = (slideIndex - activeIndex + total) % total
  const base: CSSProperties = {
    zIndex: 0,
    borderRadius: 12,
    filter: 'blur(4px)',
    width: 180,
    height: 180,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) scale(0.7)',
  }

  if (offset === 0) {
    return {
      ...base,
      zIndex: 10,
      filter: 'none',
      transform: 'translate(-50%, -50%) scale(1)',
      boxShadow: '0 0 15px rgb(0 0 0 / 0.2)',
      borderRadius: 14,
      width: 200,
      height: 200,
    }
  }

  if (offset === 1) {
    return {
      ...base,
      zIndex: 5,
      transform: 'translate(-50%, -50%) scale(1) translateX(185px) translateY(40px) rotate(20deg)',
    }
  }

  if (offset === total - 1) {
    return {
      ...base,
      zIndex: 5,
      transform:
        'translate(-50%, -50%) scale(1) translateX(-185px) translateY(40px) rotate(-20deg)',
    }
  }

  const side = offset <= total / 2 ? 1 : -1
  return {
    ...base,
    zIndex: 1,
    opacity: 0,
    transform: `translate(-50%, -50%) scale(0.87) translateX(${side * 350}px) translateY(140px) rotate(${side * 50}deg)`,
  }
}
