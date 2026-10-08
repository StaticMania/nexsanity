import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    headingField,
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: 'faqItem',
          title: 'Question',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        }),
      ],
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'FAQ' }),
  },
})
