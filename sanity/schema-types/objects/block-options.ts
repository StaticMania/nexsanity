import { ControlsIcon } from '@sanity/icons/Controls'
import { defineField, defineType } from 'sanity'

export const blockOptions = defineType({
  name: 'blockOptions',
  title: 'Block options',
  type: 'object',
  icon: ControlsIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      initialValue: 'light',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Muted', value: 'muted' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'spacing',
      title: 'Vertical spacing',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          { title: 'Tight', value: 'tight' },
          { title: 'Compact', value: 'compact' },
          { title: 'Default', value: 'default' },
          { title: 'Spacious', value: 'spacious' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'hasAnimation',
      title: 'Animate this block',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
