import { defineField } from 'sanity'

export const headingField = defineField({
  name: 'heading',
  title: 'Heading',
  type: 'string',
  validation: (rule) => rule.required(),
})
