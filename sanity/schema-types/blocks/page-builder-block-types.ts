export const pageBuilderBlockTypes = [
  'heroBlock',
  'featureColumnsBlock',
  'servicesBlock',
  'bentoGridBlock',
  'processBlock',
  'resultsBlock',
  'logoCloudBlock',
  'statsBlock',
  'teamBlock',
  'testimonialsBlock',
  'pricingBlock',
  'latestPostsBlock',
  'faqBlock',
  'ctaBlock',
  'richTextBlock',
  'contactFormBlock',
] as const

export type PageBuilderBlockType = (typeof pageBuilderBlockTypes)[number]
