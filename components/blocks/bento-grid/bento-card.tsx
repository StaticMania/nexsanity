import Image from 'next/image'
import { stegaClean } from 'next-sanity'

import { cn } from '@/lib/cn'
import type { SubheadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import type { BlockOfType } from '@/types/content'

type BentoCardData = BlockOfType<'bentoGridBlock'>['cards'][number]

type BentoCardProps = {
  card: BentoCardData
  headingLevel: SubheadingLevel
}

const toneClassNames = {
  light: 'bg-canvas text-ink ring-1 ring-line',
  muted: 'bg-surface text-ink',
  tan: 'bg-tan text-ink',
  dark: 'bg-inverse text-inverse-ink',
  accent: 'bg-accent text-accent-ink',
} as const

export function BentoCard({ card, headingLevel: HeadingTag }: BentoCardProps) {
  const tone = readTone(card.tone)
  const isWide = stegaClean(card.size) === 'wide'
  const isCover = stegaClean(card.imageStyle) === 'cover'
  const image = buildImageProps(card.image, {
    width: isWide && isCover ? 1400 : 720,
    aspectRatio: readImageAspectRatio(isCover, isWide),
  })
  const hasCoverImage = isCover && image !== null
  const hasInsetImage = !isCover && image !== null

  return (
    <li
      data-reveal
      className={cn(
        'group relative isolate flex flex-col justify-end overflow-hidden rounded-panel p-7 md:min-h-100 md:p-9',
        image ? 'min-h-80' : 'min-h-52',
        hasCoverImage ? 'bg-inverse text-inverse-ink' : toneClassNames[tone],
        isWide && 'md:col-span-2',
      )}
    >
      {hasCoverImage && (
        <>
          <Image
            {...image}
            alt={image.alt}
            sizes={isWide ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
            className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-104"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-inverse/85 via-inverse/25 to-transparent"
          />
        </>
      )}
      {hasInsetImage && (
        <div
          className={cn(
            'relative mb-8 aspect-4/3 overflow-hidden rounded-card',
            isWide && 'md:absolute md:inset-y-9 md:right-9 md:mb-0 md:aspect-auto md:w-2/5',
          )}
        >
          <Image
            {...image}
            alt={image.alt}
            sizes={isWide ? '(min-width: 768px) 28vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
            className="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-104"
          />
        </div>
      )}
      <div className={cn(isWide && hasInsetImage && 'md:max-w-1/2 md:pr-8')}>
        <HeadingTag className="text-2xl font-medium tracking-tight md:text-3xl">
          {card.title}
        </HeadingTag>
        {card.text && <p className="mt-3 max-w-md text-pretty opacity-75">{card.text}</p>}
      </div>
    </li>
  )
}

function readTone(tone: string | null): keyof typeof toneClassNames {
  const cleanTone = stegaClean(tone)
  return isTone(cleanTone) ? cleanTone : 'light'
}

function isTone(value: string | null): value is keyof typeof toneClassNames {
  return value !== null && Object.hasOwn(toneClassNames, value)
}

function readImageAspectRatio(isCover: boolean, isWide: boolean): number {
  if (!isCover) return 4 / 5
  return isWide ? 16 / 9 : 3 / 4
}
