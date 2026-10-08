import { LaunchIcon } from '@sanity/icons/Launch'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { ctasField } from '@/sanity/schema-types/fields/ctas-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'
import { imageAltFields } from '@/sanity/schema-types/fields/image-alt-fields'

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call to action',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    headingField,
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
    ctasField,
    defineField({
      name: 'images',
      title: 'Fanned images',
      description: 'Shown as an auto-advancing fan above the heading. Five works best.',
      type: 'array',
      options: { layout: 'grid' },
      of: [
        defineArrayMember({ type: 'image', options: { hotspot: true }, fields: imageAltFields }),
      ],
      validation: (rule) => rule.max(7),
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading', media: 'images.0' },
    prepare: ({ title, media }) => ({ title, subtitle: 'Call to action', media }),
  },
})
