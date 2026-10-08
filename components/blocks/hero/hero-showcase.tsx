import Image from 'next/image'

import { cn } from '@/lib/cn'
import { buildSectionClassName, isAnimatedBlock, isDarkBlock } from '@/lib/content/block-options'
import { buildCtaItems } from '@/lib/content/build-cta-items'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { HeroIntro } from '@/components/animation/hero-intro'
import { CtaList } from '@/components/site/cta-list'

import type { BlockOfType } from '@/types/content'

type HeroShowcaseProps = {
  block: BlockOfType<'heroBlock'>
  headingLevel: HeadingLevel
}

const floatingStatPositions = ['left-0 top-44 items-end', 'right-0 top-20 items-start'] as const

export function HeroShowcase({ block, headingLevel: HeadingTag }: HeroShowcaseProps) {
  const isAnimated = isAnimatedBlock(block.blockOptions)
  const ctaItems = buildCtaItems(block.ctas)
  const proofAvatars = (block.proofAvatars ?? []).flatMap((avatar) => {
    const imageProps = buildImageProps(avatar, { width: 80, aspectRatio: 1 })
    return imageProps ? [{ key: avatar._key, image: imageProps }] : []
  })
  const floatingStats = (block.floatingStats ?? []).slice(0, 2).map((stat, index) => ({
    key: stat._key,
    value: stat.value,
    label: stat.label,
    position: floatingStatPositions[index] ?? floatingStatPositions[0],
    image: buildImageProps(stat.image, { width: 160, aspectRatio: 1 }),
  }))
  const showcaseCards = (block.showcaseCards ?? []).slice(0, 3).flatMap((card, index) => {
    const isFeatured = index === 1
    const imageProps = buildImageProps(card.image, {
      width: isFeatured ? 1100 : 720,
      aspectRatio: isFeatured ? 4 / 3 : 3 / 4,
    })
    return imageProps
      ? [
          {
            key: card._key,
            title: card.title,
            caption: card.caption,
            isFeatured,
            image: imageProps,
          },
        ]
      : []
  })

  const content = (
    <>
      <div className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {(block.proofLabel || proofAvatars.length > 0) && (
            <div
              data-intro-rise
              className="mb-7 inline-flex items-center gap-3 rounded-full bg-canvas py-1.5 pr-4 pl-1.5 text-sm ring-1 ring-line"
            >
              {proofAvatars.length > 0 && (
                <ul className="flex -space-x-2">
                  {proofAvatars.map(({ key, image }) => (
                    <li key={key}>
                      <Image
                        {...image}
                        alt=""
                        sizes="28px"
                        className="size-7 rounded-full object-cover ring-2 ring-canvas"
                      />
                    </li>
                  ))}
                </ul>
              )}
              {block.proofLabel && <span>{block.proofLabel}</span>}
            </div>
          )}
          <HeadingTag
            id={`${block._key}-heading`}
            className="text-display font-semibold tracking-tight text-balance"
          >
            <span data-intro-lines className="block">
              {block.eyebrowLine && <span className="block">{block.eyebrowLine}</span>}
              <span className="block">{block.headline}</span>
            </span>
          </HeadingTag>
          {block.subheadline && (
            <p
              data-intro-lines
              className="mt-6 max-w-xl text-base text-pretty opacity-70 md:text-lg"
            >
              {block.subheadline}
            </p>
          )}
          <div data-intro-ctas className="mt-8">
            <CtaList
              items={ctaItems}
              isOnDark={isDarkBlock(block.blockOptions)}
              className="justify-center"
            />
          </div>
        </div>

        {floatingStats.length > 0 && (
          <ul aria-label="Highlights" className="hidden lg:block">
            {floatingStats.map((stat) => (
              <li
                key={stat.key}
                data-intro-rise
                className={cn('absolute flex flex-col gap-3', stat.position)}
              >
                <p className="flex flex-col rounded-card bg-canvas px-5 py-3 text-left shadow-sm ring-1 ring-line">
                  <span className="font-semibold">{stat.value}</span>
                  <span className="text-xs text-muted">{stat.label}</span>
                </p>
                {stat.image && (
                  <Image
                    {...stat.image}
                    alt=""
                    sizes="56px"
                    className="size-14 rounded-card object-cover shadow-sm"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showcaseCards.length > 0 && (
        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-7">
          {showcaseCards.map((card) => (
            <li
              key={card.key}
              data-intro-rise
              className={cn(
                'relative isolate flex h-80 flex-col justify-end overflow-hidden rounded-panel p-6 text-inverse-ink lg:h-96 lg:p-8',
                card.isFeatured ? 'md:col-span-3' : 'md:col-span-2',
              )}
            >
              <Image
                {...card.image}
                alt={card.image.alt}
                sizes={
                  card.isFeatured
                    ? '(min-width: 768px) 45vw, 100vw'
                    : '(min-width: 768px) 30vw, 100vw'
                }
                className="absolute inset-0 -z-10 size-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-t from-inverse/80 via-inverse/10 to-transparent"
              />
              <p className="text-2xl font-semibold tracking-tight">{card.title}</p>
              {card.caption && <p className="mt-1 text-sm text-inverse-ink/75">{card.caption}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  )

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(
        block.blockOptions,
        'overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20',
      )}
    >
      <div className="main-container">
        {isAnimated ? <HeroIntro>{content}</HeroIntro> : content}
      </div>
    </section>
  )
}
