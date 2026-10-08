import Image from 'next/image'
import { stegaClean } from 'next-sanity'

import { buildSectionClassName, isAnimatedBlock, isDarkBlock } from '@/lib/content/block-options'
import { buildCtaItems } from '@/lib/content/build-cta-items'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { HeroIntro } from '@/components/animation/hero-intro'
import type { CarouselImage } from '@/components/blocks/hero/hero-carousel'
import { HeroCarousel } from '@/components/blocks/hero/hero-carousel'
import { HeroShowcase } from '@/components/blocks/hero/hero-showcase'
import { CtaList } from '@/components/site/cta-list'

import type { BlockOfType } from '@/types/content'

type HeroBlockProps = {
  block: BlockOfType<'heroBlock'>
  headingLevel: HeadingLevel
}

export function HeroBlock({ block, headingLevel: HeadingTag }: HeroBlockProps) {
  if (stegaClean(block.layout) === 'showcase') {
    return <HeroShowcase block={block} headingLevel={HeadingTag} />
  }

  const isAnimated = isAnimatedBlock(block.blockOptions)
  const isDark = isDarkBlock(block.blockOptions)
  const ctaItems = buildCtaItems(block.ctas)
  const carouselImages = (block.carouselImages ?? []).flatMap((image): CarouselImage[] => {
    const imageProps = buildImageProps(image, { width: 576, aspectRatio: 3 / 4 })
    return imageProps ? [{ ...imageProps, key: image._key }] : []
  })
  const heroTextClassName = 'mx-auto flex max-w-4xl flex-col items-center text-center'
  const headingContent = (
    <>
      {block.eyebrowLine && (
        <span className="block font-serif font-light tracking-tight">{block.eyebrowLine}</span>
      )}
      <span className="block">{block.headline}</span>
    </>
  )

  const heroText = (
    <>
      <HeadingTag id={`${block._key}-heading`} className="text-display font-medium text-balance">
        <span data-intro-lines className="block">
          {headingContent}
        </span>
      </HeadingTag>
      {block.subheadline && (
        <p
          data-intro-lines
          className="mt-5 w-full max-w-150 text-base text-pretty opacity-70 md:text-lg"
        >
          {block.subheadline}
        </p>
      )}
      <div data-intro-ctas className="mt-8">
        <CtaList items={ctaItems} isOnDark={isDark} className="justify-center" />
      </div>
    </>
  )

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(
        block.blockOptions,
        'overflow-x-clip pt-12 pb-8 md:pt-20 md:pb-10',
      )}
    >
      <div className="main-container">
        {isAnimated ? (
          <HeroIntro className={heroTextClassName}>{heroText}</HeroIntro>
        ) : (
          <div className={heroTextClassName}>{heroText}</div>
        )}
      </div>
      {carouselImages.length > 0 && isAnimated && (
        <div className="mt-4 md:mt-6">
          <HeroCarousel images={carouselImages} hasAutoScroll={block.hasAutoScroll ?? true} />
        </div>
      )}
      {carouselImages.length > 0 && !isAnimated && (
        <div className="main-container">
          <ul className="mt-12 flex snap-x gap-4 overflow-x-auto pb-4 md:mt-16 md:gap-6">
            {carouselImages.map((image) => (
              <li
                key={image.key}
                className="relative aspect-3/4 w-44 shrink-0 snap-start overflow-hidden rounded-card bg-surface sm:w-56 lg:w-80"
              >
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  placeholder={image.placeholder}
                  blurDataURL={image.blurDataURL}
                  sizes="(min-width: 1024px) 18rem, (min-width: 640px) 14rem, 11rem"
                  className="size-full object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
