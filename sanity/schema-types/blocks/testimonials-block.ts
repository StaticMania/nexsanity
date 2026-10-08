import { CommentIcon } from '@sanity/icons/Comment'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const testimonialsBlock = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials',
  type: 'object',
  icon: CommentIcon,
  fields: [
    headingField,
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
      validation: (rule) => rule.required().min(1).max(9).unique(),
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Testimonials' }),
  },
})
