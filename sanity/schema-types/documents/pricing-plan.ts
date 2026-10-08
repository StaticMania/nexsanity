import { CreditCardIcon } from '@sanity/icons/CreditCard'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const pricingPlan = defineType({
  name: 'pricingPlan',
  title: 'Pricing plan',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'A few words shown in the plan selector, e.g. “For growing teams”.',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'monthlyPriceCents',
      title: 'Monthly price (cents)',
      description: 'Whole US cents. 4900 shows as $49.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'yearlyPriceCents',
      title: 'Yearly price per month (cents)',
      description: 'The monthly price when billed yearly, in whole US cents.',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Highlight this plan',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'cta',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'name', monthlyPriceCents: 'monthlyPriceCents' },
    prepare: ({ title, monthlyPriceCents }) => ({
      title,
      subtitle:
        typeof monthlyPriceCents === 'number' ? `$${monthlyPriceCents / 100} / month` : undefined,
    }),
  },
})
