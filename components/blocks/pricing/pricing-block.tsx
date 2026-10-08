import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import { buildPricingPlans, findHighestSavingsPercent } from '@/lib/content/build-pricing-plans'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import { PricingPlanCard } from '@/components/blocks/pricing/pricing-plan-card'
import { PricingPlans } from '@/components/blocks/pricing/pricing-plans'

import type { BlockOfType } from '@/types/content'

type PricingBlockProps = {
  block: BlockOfType<'pricingBlock'>
  headingLevel: HeadingLevel
}

export function PricingBlock({ block, headingLevel: HeadingTag }: PricingBlockProps) {
  const plans = buildPricingPlans(block.plans)
  const subheadingLevel = toSubheadingLevel(HeadingTag)
  const isInteractive = isAnimatedBlock(block.blockOptions) || (block.hasBillingToggle ?? false)

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <HeadingTag
            id={`${block._key}-heading`}
            className="text-headline font-medium text-balance"
          >
            {block.heading}
          </HeadingTag>
          {block.intro && (
            <p className="mt-4 text-base text-pretty opacity-70 md:mt-5 md:text-lg">
              {block.intro}
            </p>
          )}
        </div>
        {isInteractive ? (
          <PricingPlans
            plans={plans}
            highestSavingsPercent={findHighestSavingsPercent(plans)}
            hasBillingToggle={block.hasBillingToggle ?? false}
            headingLevel={subheadingLevel}
          />
        ) : (
          <ul className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <li key={plan.key}>
                <PricingPlanCard
                  plan={plan}
                  billingPeriod="monthly"
                  headingLevel={subheadingLevel}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
