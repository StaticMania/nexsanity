import { ThLargeIcon } from '@sanity/icons/ThLarge'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const featureColumnsBlock = defineType({
  name: 'featureColumnsBlock',
  title: 'Feature columns',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    headingField,
    defineField({
      name: 'isHeadingVisible',
      title: 'Show the heading',
      description: 'A hidden heading is still read out by screen readers.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      validation: (rule) => rule.required().min(1).max(6),
      of: [
        defineArrayMember({
          name: 'feature',
          title: 'Feature',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Feature columns' }),
  },
})
