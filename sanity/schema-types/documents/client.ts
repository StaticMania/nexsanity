import { UsersIcon } from '@sanity/icons/Users'
import { defineField, defineType } from 'sanity'

import { defineImageField } from '@/sanity/schema-types/fields/define-image-field'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineImageField({ name: 'logo', title: 'Logo', isRequired: true }),
    defineField({
      name: 'websiteUrl',
      title: 'Website',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'websiteUrl', media: 'logo' },
  },
})
