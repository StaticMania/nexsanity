import { buildCtaItem } from '@/lib/content/build-cta-items'
import type { CtaItem } from '@/lib/content/build-cta-items'
import { formatPriceCents } from '@/lib/format/format-price'

import type { BlockOfType } from '@/types/content'

type ProjectedPlan = BlockOfType<'pricingBlock'>['plans'][number]

export type BillingPeriod = 'monthly' | 'yearly'

export type PricingPlanView = {
  key: string
  name: string
  tagline: string | null
  description: string | null
  prices: Record<BillingPeriod, string>
  priceAmounts: Record<BillingPeriod, number>
  yearlySavingsPercent: number
  features: readonly string[]
  isFeatured: boolean
  cta: CtaItem | null
}

export function buildPricingPlans(plans: readonly ProjectedPlan[]): PricingPlanView[] {
  return plans.map((plan) => ({
    key: plan._id,
    name: plan.name,
    tagline: plan.tagline,
    description: plan.description,
    prices: {
      monthly: formatPriceCents(plan.monthlyPriceCents),
      yearly: formatPriceCents(plan.yearlyPriceCents),
    },
    priceAmounts: {
      monthly: plan.monthlyPriceCents / 100,
      yearly: plan.yearlyPriceCents / 100,
    },
    yearlySavingsPercent: calculateSavingsPercent(plan.monthlyPriceCents, plan.yearlyPriceCents),
    features: plan.features,
    isFeatured: plan.isFeatured ?? false,
    cta: buildCtaItem(plan.cta),
  }))
}

export function findHighestSavingsPercent(plans: readonly PricingPlanView[]): number {
  return Math.max(0, ...plans.map((plan) => plan.yearlySavingsPercent))
}

function calculateSavingsPercent(monthlyPriceCents: number, yearlyPriceCents: number): number {
  if (monthlyPriceCents <= 0) return 0
  return Math.round(((monthlyPriceCents - yearlyPriceCents) / monthlyPriceCents) * 100)
}
