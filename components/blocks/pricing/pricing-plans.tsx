'use client'

import NumberFlow from '@number-flow/react'
import { useState } from 'react'

import type { BillingPeriod, PricingPlanView } from '@/lib/content/build-pricing-plans'
import type { SubheadingLevel } from '@/lib/content/heading-levels'

import { PricingPlanCard } from '@/components/blocks/pricing/pricing-plan-card'

type PricingPlansProps = {
  plans: readonly PricingPlanView[]
  highestSavingsPercent: number
  hasBillingToggle: boolean
  headingLevel: SubheadingLevel
}

export function PricingPlans({
  plans,
  highestSavingsPercent,
  hasBillingToggle,
  headingLevel,
}: PricingPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const isYearly = billingPeriod === 'yearly'

  return (
    <>
      {hasBillingToggle && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium md:mb-12">
          <span className={isYearly ? 'opacity-60' : undefined}>Monthly</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={isYearly}
              onChange={(event) => setBillingPeriod(event.target.checked ? 'yearly' : 'monthly')}
              className="peer sr-only"
              aria-label="Bill yearly"
            />
            <span className="h-7 w-12 rounded-full bg-ink/15 transition-colors duration-300 peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent" />
            <span className="pointer-events-none absolute top-1 left-1 size-5 rounded-full bg-canvas shadow transition-transform duration-300 ease-out-expo peer-checked:translate-x-5" />
          </label>
          <span className={isYearly ? undefined : 'opacity-60'}>Yearly</span>
          {highestSavingsPercent > 0 && (
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">
              Save up to {highestSavingsPercent}%
            </span>
          )}
        </div>
      )}
      <ul className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <li key={plan.key}>
            <PricingPlanCard
              plan={plan}
              billingPeriod={billingPeriod}
              headingLevel={headingLevel}
              price={
                <NumberFlow
                  value={plan.priceAmounts[billingPeriod]}
                  prefix="$"
                  format={{ useGrouping: true, maximumFractionDigits: 0 }}
                  transformTiming={{ duration: 700, easing: 'ease-out' }}
                  spinTiming={{ duration: 700, easing: 'ease-out' }}
                  opacityTiming={{ duration: 315, easing: 'ease-out' }}
                />
              }
            />
          </li>
        ))}
      </ul>
    </>
  )
}
