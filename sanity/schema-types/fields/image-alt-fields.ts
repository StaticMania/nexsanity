import { defineField } from 'sanity'

function isMarkedDecorative(parent: unknown): boolean {
  return (
    typeof parent === 'object' &&
    parent !== null &&
    'isDecorative' in parent &&
    parent.isDecorative === true
  )
}

export const imageAltFields = [
  defineField({
    name: 'alt',
    title: 'Alternative text',
    description: 'Describe the image for people using screen readers.',
    type: 'string',
    validation: (rule) =>
      rule.custom((alt, context) => {
        if (isMarkedDecorative(context.parent)) return true
        return alt && alt.trim().length > 0
          ? true
          : 'Alternative text is required unless the image is decorative.'
      }),
  }),
  defineField({
    name: 'isDecorative',
    title: 'Decorative image',
    description: 'Decorative images are hidden from screen readers.',
    type: 'boolean',
    initialValue: false,
  }),
]
