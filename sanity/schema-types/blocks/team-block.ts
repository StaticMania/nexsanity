import { UsersIcon } from '@sanity/icons/Users'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const teamBlock = defineType({
  name: 'teamBlock',
  title: 'Team',
  type: 'object',
  icon: UsersIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'members',
      title: 'Members',
      description: 'Team members are authors, so the same people appear on blog posts.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'author' }] })],
      validation: (rule) => rule.required().min(1).max(12).unique(),
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Team' }),
  },
})
