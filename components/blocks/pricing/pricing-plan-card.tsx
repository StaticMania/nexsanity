import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import type { BillingPeriod, PricingPlanView } from '@/lib/content/build-pricing-plans'
import type { SubheadingLevel } from '@/lib/content/heading-levels'

import { ButtonLink } from '@/components/ui/button-link'

type PricingPlanCardProps = {
  plan: PricingPlanView
  billingPeriod: BillingPeriod
  headingLevel: SubheadingLevel
  price?: ReactNode
}

export function PricingPlanCard({
  plan,
  billingPeriod,
  headingLevel: HeadingTag,
  price,
}: PricingPlanCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-panel p-6 sm:p-8 md:p-10',
        plan.isFeatured ? 'bg-inverse text-inverse-ink' : 'bg-canvas text-ink ring-1 ring-line',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <HeadingTag className="text-lg font-medium md:text-xl">{plan.name}</HeadingTag>
        {plan.isFeatured && (
          <p className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink">
            Most popular
          </p>
        )}
      </div>
      {plan.tagline && <p className="mt-1 text-sm opacity-60">{plan.tagline}</p>}
      {plan.description && (
        <p className="mt-3 text-sm text-pretty opacity-70 md:text-base lg:min-h-18">
          {plan.description}
        </p>
      )}
      <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 md:mt-8">
        <span className="font-serif text-4xl tracking-tight tabular-nums sm:text-5xl xl:text-6xl">
          {price ?? plan.prices[billingPeriod]}
        </span>
        <span className="text-sm opacity-60 md:text-base">
          / month{billingPeriod === 'yearly' ? ', billed yearly' : ''}
        </span>
      </p>
      <ul className="mt-6 space-y-3 border-t border-current/15 pt-6 text-sm md:mt-8 md:pt-8 md:text-base">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent md:size-5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.cta && (
        <ButtonLink
          href={plan.cta.href}
          size="large"
          intent={plan.isFeatured ? 'inverse' : 'primary'}
          className="mt-8 w-full justify-between pl-6 md:mt-10"
        >
          {plan.cta.label}
        </ButtonLink>
      )}
    </article>
  )
}
