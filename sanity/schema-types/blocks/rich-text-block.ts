import { TextIcon } from '@sanity/icons/Text'
import { defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { definePortableTextField } from '@/sanity/schema-types/fields/define-portable-text-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Rich text',
  type: 'object',
  icon: TextIcon,
  fields: [
    headingField,
    definePortableTextField({ name: 'body', title: 'Body', isRequired: true }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Rich text' }),
  },
})
