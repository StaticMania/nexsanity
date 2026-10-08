import { cn } from '@/lib/cn'
import { buildSectionClassName } from '@/lib/content/block-options'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import type { BlockOfType } from '@/types/content'

type FeatureColumnsBlockProps = {
  block: BlockOfType<'featureColumnsBlock'>
  headingLevel: HeadingLevel
}

export function FeatureColumnsBlock({ block, headingLevel: HeadingTag }: FeatureColumnsBlockProps) {
  const SubheadingTag = toSubheadingLevel(HeadingTag)

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <HeadingTag
          id={`${block._key}-heading`}
          className={cn(
            block.isHeadingVisible
              ? 'mx-auto mb-12 max-w-2xl text-center text-headline font-medium text-balance'
              : 'sr-only',
          )}
        >
          {block.heading}
        </HeadingTag>
        <ul className="mx-auto grid max-w-5xl divide-y divide-current/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {block.features.map((feature) => (
            <li key={feature._key} className="px-6 py-8 text-center md:px-10 md:py-2">
              <SubheadingTag className="text-lg font-medium tracking-tight">
                {feature.title}
              </SubheadingTag>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-pretty opacity-60">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
