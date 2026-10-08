import { CaseIcon } from '@sanity/icons/Case'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { defineImageField } from '@/sanity/schema-types/fields/define-image-field'
import { definePortableTextField } from '@/sanity/schema-types/fields/define-portable-text-field'
import { imageAltFields } from '@/sanity/schema-types/fields/image-alt-fields'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{ type: 'client' }],
      validation: (rule) => rule.required(),
    }),
    defineImageField({ name: 'coverImage', title: 'Cover image', isRequired: true }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({ name: 'industry', title: 'Industry', type: 'string' }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'duration',
      title: 'Project duration',
      description: 'For example “8 weeks”.',
      type: 'string',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          name: 'metric',
          title: 'Metric',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              description: 'For example “+42%” or “3.2x”.',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    definePortableTextField({ name: 'body', title: 'Body', isRequired: true }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      options: { layout: 'grid' },
      of: [
        defineArrayMember({ type: 'image', options: { hotspot: true }, fields: imageAltFields }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{ type: 'testimonial' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'client.name', media: 'coverImage' },
  },
})
