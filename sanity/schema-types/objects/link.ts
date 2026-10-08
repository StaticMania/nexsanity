import { LinkIcon } from '@sanity/icons/Link'
import { defineField, defineType } from 'sanity'

function readLinkType(parent: unknown): string | undefined {
  if (typeof parent !== 'object' || parent === null || !('linkType' in parent)) return undefined
  return typeof parent.linkType === 'string' ? parent.linkType : undefined
}

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          { title: 'Internal page', value: 'internal' },
          { title: 'URL or path', value: 'external' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalReference',
      title: 'Internal page',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'post' }, { type: 'caseStudy' }, { type: 'category' }],
      hidden: ({ parent }) => readLinkType(parent) !== 'internal',
      validation: (rule) =>
        rule.custom((reference, context) =>
          readLinkType(context.parent) === 'internal' && !reference
            ? 'Choose the page this link points to.'
            : true,
        ),
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL or path',
      description: 'A full URL, or a path on this site such as /blog or /customers.',
      type: 'url',
      hidden: ({ parent }) => readLinkType(parent) !== 'external',
      validation: (rule) =>
        rule
          .uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true })
          .custom((url, context) =>
            readLinkType(context.parent) === 'external' && !url ? 'Add the URL.' : true,
          ),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      linkType: 'linkType',
      externalUrl: 'externalUrl',
      referenceTitle: 'internalReference.title',
    },
    prepare: ({ label, linkType, externalUrl, referenceTitle }) => ({
      title: label ?? referenceTitle ?? externalUrl ?? 'Untitled link',
      subtitle: linkType === 'external' ? externalUrl : referenceTitle,
    }),
  },
})
