import { ChartUpwardIcon } from '@sanity/icons/ChartUpward'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const resultsBlock = defineType({
  name: 'resultsBlock',
  title: 'Results',
  type: 'object',
  icon: ChartUpwardIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'caseStudies',
      title: 'Case studies',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'caseStudy' }] })],
      validation: (rule) => rule.required().min(1).max(6).unique(),
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Results' }),
  },
})
