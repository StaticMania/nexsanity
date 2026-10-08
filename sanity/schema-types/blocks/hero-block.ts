import { HomeIcon } from '@sanity/icons/Home'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { blockOptionsField } from '@/sanity/schema-types/fields/block-options-field'
import { ctasField } from '@/sanity/schema-types/fields/ctas-field'
import { defineImageField } from '@/sanity/schema-types/fields/define-image-field'
import { imageAltFields } from '@/sanity/schema-types/fields/image-alt-fields'
import { readParentField } from '@/sanity/schema-types/fields/read-parent-field'

const isShowcase = ({ parent }: { parent?: unknown }) =>
  readParentField(parent, 'layout') === 'showcase'
const isRing = ({ parent }: { parent?: unknown }) => !isShowcase({ parent })

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'ring',
      options: {
        list: [
          { title: 'Image ring', value: 'ring' },
          { title: 'Showcase', value: 'showcase' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'proofLabel',
      title: 'Proof label',
      description: 'A short line beside the avatars, such as “Trusted by 60+ product teams”.',
      type: 'string',
      hidden: isRing,
    }),
    defineField({
      name: 'proofAvatars',
      title: 'Proof avatars',
      type: 'array',
      options: { layout: 'grid' },
      hidden: isRing,
      of: [
        defineArrayMember({ type: 'image', options: { hotspot: true }, fields: imageAltFields }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'eyebrowLine',
      title: 'First line',
      description: 'The first headline line. The image ring layout sets it in the serif font.',
      type: 'string',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 3 }),
    ctasField,
    defineField({
      name: 'carouselImages',
      title: 'Carousel images',
      type: 'array',
      options: { layout: 'grid' },
      hidden: isShowcase,
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: imageAltFields,
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'hasAutoScroll',
      title: 'Scroll the carousel automatically',
      type: 'boolean',
      initialValue: true,
      hidden: isShowcase,
    }),
    defineField({
      name: 'floatingStats',
      title: 'Floating stats',
      description: 'Shown beside the headline on large screens, one on each side.',
      type: 'array',
      hidden: isRing,
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          name: 'floatingStat',
          title: 'Stat',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineImageField({ name: 'image', title: 'Image' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'showcaseCards',
      title: 'Showcase cards',
      type: 'array',
      hidden: isRing,
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          name: 'showcaseCard',
          title: 'Card',
          type: 'object',
          fields: [
            defineImageField({ name: 'image', title: 'Image', isRequired: true }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'caption', media: 'image' } },
        }),
      ],
    }),
    blockOptionsField,
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrowLine', media: 'carouselImages.0' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle: subtitle ?? 'Hero', media }),
  },
})
