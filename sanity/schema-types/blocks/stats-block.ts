import { BarChartIcon } from '@sanity/icons/BarChart'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const statsBlock = defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    headingField,
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      validation: (rule) => rule.required().min(2).max(4),
      of: [
        defineArrayMember({
          name: 'stat',
          title: 'Stat',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              description: 'Numbers count up on scroll, for example 120+, 98% or $4.2M.',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Stats' }),
  },
})
