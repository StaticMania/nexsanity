import { SearchIcon } from '@sanity/icons/Search'
import { defineField, defineType } from 'sanity'

import { defineImageField } from '@/sanity/schema-types/fields/define-image-field'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Keep meta titles under 60 characters.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep meta descriptions under 160 characters.'),
    }),
    defineImageField({ name: 'ogImage', title: 'Social sharing image' }),
    defineField({
      name: 'isIndexable',
      title: 'Allow search engines to index this page',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
