import type { StegaBranded } from 'next-sanity'

import type {
  CaseStudiesPageQueryResult,
  CaseStudyBySlugQueryResult,
  CategoriesQueryResult,
  CategoryPostsPageQueryResult,
  PageBySlugQueryResult,
  PostBySlugQueryResult,
  PostsPageQueryResult,
  SettingsQueryResult,
} from '@/sanity/sanity.types'

export type SiteSettings = StegaBranded<SettingsQueryResult>
export type PageDocument = NonNullable<StegaBranded<PageBySlugQueryResult>>
export type PageBuilderBlock = NonNullable<PageDocument['pageBuilder']>[number]
export type BlockOfType<BlockType extends PageBuilderBlock['_type']> = Extract<
  PageBuilderBlock,
  { _type: BlockType }
>
export type PostDocument = NonNullable<StegaBranded<PostBySlugQueryResult>>
export type PostCard = StegaBranded<PostsPageQueryResult>['posts'][number]
export type CategorySummary = StegaBranded<CategoriesQueryResult>[number]
export type CategoryDocument = NonNullable<StegaBranded<CategoryPostsPageQueryResult>['category']>
export type CaseStudyDocument = NonNullable<StegaBranded<CaseStudyBySlugQueryResult>>
export type CaseStudyCard = StegaBranded<CaseStudiesPageQueryResult>['caseStudies'][number]
