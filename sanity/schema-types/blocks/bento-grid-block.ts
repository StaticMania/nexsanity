import { DashboardIcon } from '@sanity/icons/Dashboard'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { defineImageField } from '@/sanity/schema-types/fields/define-image-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'
import { readParentField } from '@/sanity/schema-types/fields/read-parent-field'

export const bentoGridBlock = defineType({
  name: 'bentoGridBlock',
  title: 'Bento grid',
  type: 'object',
  icon: DashboardIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      validation: (rule) => rule.required().min(2).max(8),
      of: [
        defineArrayMember({
          name: 'bentoCard',
          title: 'Card',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
            defineImageField({ name: 'image', title: 'Image' }),
            defineField({
              name: 'imageStyle',
              title: 'Image style',
              type: 'string',
              initialValue: 'inset',
              hidden: ({ parent }) => !readParentField(parent, 'image'),
              options: {
                list: [
                  { title: 'Fill the card', value: 'cover' },
                  { title: 'Inset beside the text', value: 'inset' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
            }),
            defineField({
              name: 'tone',
              title: 'Tone',
              type: 'string',
              initialValue: 'light',
              options: {
                list: [
                  { title: 'Light', value: 'light' },
                  { title: 'Muted', value: 'muted' },
                  { title: 'Tan', value: 'tan' },
                  { title: 'Dark', value: 'dark' },
                  { title: 'Accent', value: 'accent' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              initialValue: 'narrow',
              options: {
                list: [
                  { title: 'Wide', value: 'wide' },
                  { title: 'Narrow', value: 'narrow' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'size', media: 'image' } },
        }),
      ],
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Bento grid' }),
  },
})
