import { defineArrayMember, defineField } from 'sanity'
import type { FieldDefinition } from 'sanity'

import { imageAltFields } from '@/sanity/schema-types/fields/image-alt-fields'

type PortableTextFieldOptions = {
  name: string
  title: string
  isRequired?: boolean
  group?: string
}

export function definePortableTextField({
  name,
  title,
  isRequired = false,
  group,
}: PortableTextFieldOptions): FieldDefinition {
  return defineField({
    name,
    title,
    group,
    type: 'array',
    validation: (rule) => (isRequired ? rule.required().min(1) : rule),
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'Heading 2', value: 'h2' },
          { title: 'Heading 3', value: 'h3' },
          { title: 'Quote', value: 'blockquote' },
        ],
        lists: [
          { title: 'Bullet', value: 'bullet' },
          { title: 'Numbered', value: 'number' },
        ],
        marks: {
          decorators: [
            { title: 'Strong', value: 'strong' },
            { title: 'Emphasis', value: 'em' },
            { title: 'Code', value: 'code' },
          ],
          annotations: [defineArrayMember({ name: 'link', title: 'Link', type: 'link' })],
        },
      }),
      defineArrayMember({
        name: 'inlineImage',
        title: 'Image',
        type: 'image',
        options: { hotspot: true },
        validation: (rule) => rule.required(),
        fields: [
          ...imageAltFields,
          defineField({ name: 'caption', title: 'Caption', type: 'string' }),
        ],
      }),
    ],
  })
}
