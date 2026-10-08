import { CreditCardIcon } from '@sanity/icons/CreditCard'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const pricingBlock = defineType({
  name: 'pricingBlock',
  title: 'Pricing',
  type: 'object',
  icon: CreditCardIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'plans',
      title: 'Plans',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'pricingPlan' }] })],
      validation: (rule) => rule.required().min(1).max(4).unique(),
    }),
    defineField({
      name: 'hasBillingToggle',
      title: 'Show the monthly / yearly toggle',
      type: 'boolean',
      initialValue: true,
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Pricing' }),
  },
})
