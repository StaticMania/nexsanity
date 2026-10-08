import { UsersIcon } from '@sanity/icons/Users'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo cloud',
  type: 'object',
  icon: UsersIcon,
  fields: [
    headingField,
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'client' }] })],
      validation: (rule) => rule.required().min(3).max(12).unique(),
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Logo cloud' }),
  },
})
