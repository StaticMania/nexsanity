import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { headingField } from '@/sanity/schema-types/fields/heading-field'

export const contactFormBlock = defineType({
  name: 'contactFormBlock',
  title: 'Contact form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'contactDescription',
      title: 'Contact panel description',
      type: 'text',
      rows: 2,
    }),
    defineField({ name: 'contactPhone', title: 'Phone number', type: 'string' }),
    defineField({ name: 'contactEmail', title: 'Email address', type: 'string' }),
    defineField({ name: 'contactAddress', title: 'Address', type: 'string' }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
      initialValue: "Thanks! We'll get back to you within one business day.",
      validation: (rule) => rule.required(),
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Contact form' }),
  },
})
