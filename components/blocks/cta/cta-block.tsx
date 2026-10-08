import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { buildCtaItems } from '@/lib/content/build-cta-items'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { RevealLines } from '@/components/animation/reveal-lines'
import { CtaList } from '@/components/site/cta-list'
import { ImageFanSlider } from '@/components/tweenui/image-fan-slider'
import type { FanImage } from '@/components/tweenui/image-fan-slider'
import { ShinyLink } from '@/components/tweenui/shiny-link'

import type { BlockOfType } from '@/types/content'

type CtaBlockProps = {
  block: BlockOfType<'ctaBlock'>
  headingLevel: HeadingLevel
}

export function CtaBlock({ block, headingLevel: HeadingTag }: CtaBlockProps) {
  const isAnimated = isAnimatedBlock(block.blockOptions)
  const [primaryCta, ...secondaryCtas] = buildCtaItems(block.ctas)
  const fanImages = (block.images ?? []).flatMap((image): FanImage[] => {
    const imageProps = buildImageProps(image, { width: 400, aspectRatio: 1 })
    return imageProps ? [{ ...imageProps, key: image._key }] : []
  })

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions, 'overflow-x-clip')}
    >
      <div className="main-container">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          {fanImages.length > 0 && <ImageFanSlider images={fanImages} />}
          <div>
            <HeadingTag
              id={`${block._key}-heading`}
              className="text-headline font-medium text-balance"
            >
              {isAnimated ? <RevealLines>{block.heading}</RevealLines> : block.heading}
            </HeadingTag>
            {block.text && (
              <p className="mx-auto mt-4 max-w-md text-lg text-pretty opacity-70">{block.text}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {primaryCta && <ShinyLink href={primaryCta.href}>{primaryCta.label}</ShinyLink>}
            <CtaList items={secondaryCtas} />
          </div>
        </div>
      </div>
    </section>
  )
}
