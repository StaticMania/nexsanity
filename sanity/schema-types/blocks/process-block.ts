import { OlistIcon } from '@sanity/icons/Olist'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'
import { imageAltFields } from '@/sanity/schema-types/fields/image-alt-fields'

export const processBlock = defineType({
  name: 'processBlock',
  title: 'Process',
  type: 'object',
  icon: OlistIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      validation: (rule) => rule.required().min(2).max(6),
      of: [
        defineArrayMember({
          name: 'processStep',
          title: 'Step',
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
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: imageAltFields,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description', media: 'image' } },
        }),
      ],
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Process' }),
  },
})
