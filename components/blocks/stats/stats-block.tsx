import { stegaClean } from 'next-sanity'

import { parseStatValue } from '@/lib/animation/parse-stat-value'
import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import { NumberCounter } from '@/components/tweenui/number-counter'

import type { BlockOfType } from '@/types/content'

type StatsBlockProps = {
  block: BlockOfType<'statsBlock'>
  headingLevel: HeadingLevel
}

export function StatsBlock({ block, headingLevel: HeadingTag }: StatsBlockProps) {
  const isAnimated = isAnimatedBlock(block.blockOptions)

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <HeadingTag
          id={`${block._key}-heading`}
          className="max-w-3xl text-headline font-medium text-balance"
        >
          {block.heading}
        </HeadingTag>
        <dl className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {block.stats.map((stat, statIndex) => {
            const parsedValue = isAnimated ? parseStatValue(stegaClean(stat.value)) : null
            return (
              <div
                key={stat._key}
                className="flex flex-col-reverse border-t border-current/15 pt-6"
              >
                <dt className="mt-2 opacity-70">{stat.label}</dt>
                <dd className="font-serif text-6xl tracking-tight tabular-nums md:text-7xl">
                  {parsedValue ? (
                    <NumberCounter
                      value={parsedValue.number}
                      prefix={parsedValue.prefix}
                      suffix={parsedValue.suffix}
                      decimals={parsedValue.decimals}
                      delay={statIndex * 0.12}
                    />
                  ) : (
                    stat.value
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
