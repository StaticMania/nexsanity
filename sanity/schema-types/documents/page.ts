import { DocumentIcon } from '@sanity/icons/Document'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { pageBuilderBlockTypes } from '@/sanity/schema-types/blocks/page-builder-block-types'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Use “home” for the home page.',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      description: 'The first block’s heading becomes the page’s main heading.',
      type: 'array',
      group: 'content',
      of: pageBuilderBlockTypes.map((blockType) => defineArrayMember({ type: blockType })),
      options: {
        insertMenu: {
          views: [{ name: 'grid' }, { name: 'list' }],
        },
      },
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({ title, subtitle: slug === 'home' ? '/' : `/${slug ?? ''}` }),
  },
})
