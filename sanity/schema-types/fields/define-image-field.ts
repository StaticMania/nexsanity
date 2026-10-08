import { defineField } from 'sanity'
import type { FieldDefinition } from 'sanity'

import { imageAltFields } from '@/sanity/schema-types/fields/image-alt-fields'

type ImageFieldOptions = {
  name: string
  title: string
  description?: string
  isRequired?: boolean
  group?: string
}

export function defineImageField({
  name,
  title,
  description,
  isRequired = false,
  group,
}: ImageFieldOptions): FieldDefinition {
  return defineField({
    name,
    title,
    description,
    group,
    type: 'image',
    options: { hotspot: true },
    validation: (rule) => (isRequired ? rule.required() : rule),
    fields: imageAltFields,
  })
}
