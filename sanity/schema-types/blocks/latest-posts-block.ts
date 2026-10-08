import { ComposeIcon } from '@sanity/icons/Compose'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const latestPostsBlock = defineType({
  name: 'latestPostsBlock',
  title: 'Latest posts',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'posts',
      title: 'Pinned posts',
      description: 'Leave empty to show the three most recent posts.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
      validation: (rule) => rule.max(3).unique(),
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Latest posts' }),
  },
})
