import { defineArrayMember, defineField } from 'sanity'

export const ctasField = defineField({
  name: 'ctas',
  title: 'Buttons',
  type: 'array',
  of: [defineArrayMember({ type: 'cta' })],
  validation: (rule) => rule.max(2),
})
