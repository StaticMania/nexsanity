import { CommentIcon } from '@sanity/icons/Comment'
import { defineField, defineType } from 'sanity'

import { defineImageField } from '@/sanity/schema-types/fields/define-image-field'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'authorRole', title: 'Author role', type: 'string' }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineImageField({ name: 'avatar', title: 'Avatar' }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'company', media: 'avatar' },
  },
})
