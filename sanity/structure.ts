import { CogIcon } from '@sanity/icons/Cog'
import type { StructureResolver } from 'sanity/structure'

export const singletonTypes = new Set(['settings'])

const collectionTypes = [
  'page',
  'post',
  'caseStudy',
  'category',
  'author',
  'testimonial',
  'client',
  'pricingPlan',
] as const

export const structure: StructureResolver = (builder) =>
  builder
    .list()
    .title('Content')
    .items([
      builder
        .listItem()
        .title('Site settings')
        .id('settings')
        .icon(CogIcon)
        .child(builder.document().schemaType('settings').documentId('settings')),
      builder.divider(),
      ...collectionTypes.map((schemaType) => builder.documentTypeListItem(schemaType)),
    ])
