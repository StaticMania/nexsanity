import { CogIcon } from '@sanity/icons/Cog'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { defineImageField } from '@/sanity/schema-types/fields/define-image-field'

const hexColorPattern = /^#(?:[\da-f]{3}){1,2}$/i

function defineColorField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    description,
    type: 'string',
    validation: (rule) => rule.regex(hexColorPattern, { name: 'hex colour' }),
  })
}

export const settings = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'seo', title: 'SEO' },
    { name: 'theme', title: 'Theme' },
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineImageField({
      name: 'logo',
      title: 'Logo',
      description: 'Leave empty to show the site title as a wordmark.',
      group: 'general',
    }),
    defineField({
      name: 'primaryNavigation',
      title: 'Primary navigation',
      description: 'The first half shows left of the logo, the rest on the right.',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({ type: 'link' })],
      validation: (rule) => rule.max(7),
    }),
    defineField({
      name: 'secondaryNavigation',
      title: 'Secondary navigation',
      description: 'Legal and utility links shown at the bottom of the footer.',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({ type: 'link' })],
    }),
    defineField({ name: 'headerCta', title: 'Header button', type: 'cta', group: 'navigation' }),
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'text',
      rows: 2,
      group: 'footer',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      group: 'footer',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          name: 'footerColumn',
          title: 'Column',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({ type: 'link' })],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          name: 'socialLink',
          title: 'Social link',
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['X', 'LinkedIn', 'GitHub', 'Instagram', 'YouTube', 'Dribbble', 'Behance'],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['https'] }),
            }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo' }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'object',
      group: 'theme',
      fields: [
        defineField({
          name: 'colorScheme',
          title: 'Colour scheme',
          type: 'string',
          initialValue: 'light',
          options: {
            list: [
              { title: 'Light', value: 'light' },
              { title: 'Dark', value: 'dark' },
              { title: 'Follow the visitor’s system', value: 'system' },
            ],
            layout: 'radio',
          },
        }),
        defineColorField('backgroundColor', 'Background', 'Page background, e.g. #fdf8ee'),
        defineColorField('surfaceColor', 'Surface', 'Muted sections and cards, e.g. #efe6da'),
        defineColorField('accentColor', 'Accent', 'Buttons and highlights, e.g. #5b6b4e'),
        defineColorField('foregroundColor', 'Text', 'Body text and dark sections, e.g. #111111'),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
