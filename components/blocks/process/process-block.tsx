import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { ProcessStickySteps } from '@/components/tweenui/process-sticky-steps'

import type { BlockOfType } from '@/types/content'

type ProcessBlockProps = {
  block: BlockOfType<'processBlock'>
  headingLevel: HeadingLevel
}

export function ProcessBlock({ block, headingLevel: HeadingTag }: ProcessBlockProps) {
  const subheadingLevel = toSubheadingLevel(HeadingTag)
  const SubheadingTag = subheadingLevel
  const steps = block.steps.map((step) => ({
    key: step._key,
    title: step.title,
    description: step.description,
    image: buildImageProps(step.image, { width: 960, aspectRatio: 16 / 9 }),
  }))
  const header = (
    <>
      <HeadingTag id={`${block._key}-heading`} className="text-headline font-medium text-balance">
        {block.heading}
      </HeadingTag>
      {block.intro && <p className="mt-5 max-w-md text-lg text-pretty opacity-70">{block.intro}</p>}
    </>
  )

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        {isAnimatedBlock(block.blockOptions) ? (
          <ProcessStickySteps header={header} steps={steps} headingLevel={subheadingLevel} />
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">{header}</div>
            <ol className="space-y-10 lg:col-span-7">
              {steps.map((step, index) => (
                <li key={step.key} className="flex gap-5 border-t border-current/15 pt-6">
                  <span className="font-serif text-3xl leading-none text-accent tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <SubheadingTag className="text-2xl font-medium tracking-tight">
                      {step.title}
                    </SubheadingTag>
                    <p className="mt-2 text-pretty opacity-70">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
