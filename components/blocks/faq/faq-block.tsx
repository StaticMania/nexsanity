import { Plus } from 'lucide-react'

import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import { FaqAccordion } from '@/components/tweenui/faq-accordion'

import type { BlockOfType } from '@/types/content'

type FaqBlockProps = {
  block: BlockOfType<'faqBlock'>
  headingLevel: HeadingLevel
}

export function FaqBlock({ block, headingLevel: HeadingTag }: FaqBlockProps) {
  const items = block.questions.map((item) => ({
    key: item._key,
    question: item.question,
    answer: item.answer,
  }))

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="grid gap-12 lg:grid-cols-12">
          <HeadingTag
            id={`${block._key}-heading`}
            className="text-headline font-medium text-balance lg:col-span-5"
          >
            {block.heading}
          </HeadingTag>
          <div className="lg:col-span-7">
            {isAnimatedBlock(block.blockOptions) ? (
              <FaqAccordion items={items} headingLevel={toSubheadingLevel(HeadingTag)} />
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.key} className="rounded-card bg-canvas ring-1 ring-line">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-lg font-medium">
                        {item.question}
                        <Plus
                          aria-hidden="true"
                          className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                        />
                      </summary>
                      <p className="px-6 pb-6 text-pretty text-muted">{item.answer}</p>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
