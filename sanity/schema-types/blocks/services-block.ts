import { BulbOutlineIcon } from '@sanity/icons/BulbOutline'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const servicesBlock = defineType({
  name: 'servicesBlock',
  title: 'Services',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'services',
      title: 'Services',
      description: 'Each row rolls over on hover and links to its page.',
      type: 'array',
      validation: (rule) => rule.required().min(1).max(8),
      of: [
        defineArrayMember({
          name: 'service',
          title: 'Service',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'label', title: 'Short label', type: 'string' }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'label' } },
        }),
      ],
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Services' }),
  },
})
