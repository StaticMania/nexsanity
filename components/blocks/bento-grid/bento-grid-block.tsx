import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import { RevealGroup } from '@/components/animation/reveal-group'
import { BentoCard } from '@/components/blocks/bento-grid/bento-card'

import type { BlockOfType } from '@/types/content'

type BentoGridBlockProps = {
  block: BlockOfType<'bentoGridBlock'>
  headingLevel: HeadingLevel
}

export function BentoGridBlock({ block, headingLevel: HeadingTag }: BentoGridBlockProps) {
  const subheadingLevel = toSubheadingLevel(HeadingTag)
  const cardList = (
    <ul className="grid gap-4 md:grid-cols-3">
      {block.cards.map((card) => (
        <BentoCard key={card._key} card={card} headingLevel={subheadingLevel} />
      ))}
    </ul>
  )

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="mx-auto max-w-3xl text-center">
          <HeadingTag
            id={`${block._key}-heading`}
            className="text-headline font-medium text-balance"
          >
            {block.heading}
          </HeadingTag>
          {block.intro && <p className="mt-5 text-lg text-pretty opacity-70">{block.intro}</p>}
        </div>
        <div className="mt-14">
          {isAnimatedBlock(block.blockOptions) ? <RevealGroup>{cardList}</RevealGroup> : cardList}
        </div>
      </div>
    </section>
  )
}
