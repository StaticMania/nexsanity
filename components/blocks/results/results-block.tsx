import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import { RevealGroup } from '@/components/animation/reveal-group'
import { CaseStudyCard } from '@/components/customers/case-study-card'

import type { BlockOfType } from '@/types/content'

type ResultsBlockProps = {
  block: BlockOfType<'resultsBlock'>
  headingLevel: HeadingLevel
}

export function ResultsBlock({ block, headingLevel: HeadingTag }: ResultsBlockProps) {
  const subheadingLevel = toSubheadingLevel(HeadingTag)
  const hasThreeColumns = block.caseStudies.length % 3 === 0
  const caseStudyList = (
    <ul
      className={cn(
        'grid gap-x-8 gap-y-16 md:grid-cols-2',
        hasThreeColumns && 'lg:grid-cols-3 lg:gap-x-6',
      )}
    >
      {block.caseStudies.map((caseStudy) => (
        <li key={caseStudy._id} data-reveal>
          <CaseStudyCard caseStudy={caseStudy} headingLevel={subheadingLevel} />
        </li>
      ))}
    </ul>
  )

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <HeadingTag
              id={`${block._key}-heading`}
              className="text-headline font-medium text-balance"
            >
              {block.heading}
            </HeadingTag>
            {block.intro && <p className="mt-5 text-lg text-pretty opacity-70">{block.intro}</p>}
          </div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            All customer stories
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-14">
          {isAnimatedBlock(block.blockOptions) ? (
            <RevealGroup>{caseStudyList}</RevealGroup>
          ) : (
            caseStudyList
          )}
        </div>
      </div>
    </section>
  )
}
