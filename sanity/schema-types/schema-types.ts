import type { SchemaTypeDefinition } from 'sanity'

import { bentoGridBlock } from '@/sanity/schema-types/blocks/bento-grid-block'
import { contactFormBlock } from '@/sanity/schema-types/blocks/contact-form-block'
import { ctaBlock } from '@/sanity/schema-types/blocks/cta-block'
import { faqBlock } from '@/sanity/schema-types/blocks/faq-block'
import { featureColumnsBlock } from '@/sanity/schema-types/blocks/feature-columns-block'
import { heroBlock } from '@/sanity/schema-types/blocks/hero-block'
import { latestPostsBlock } from '@/sanity/schema-types/blocks/latest-posts-block'
import { logoCloudBlock } from '@/sanity/schema-types/blocks/logo-cloud-block'
import { pricingBlock } from '@/sanity/schema-types/blocks/pricing-block'
import { processBlock } from '@/sanity/schema-types/blocks/process-block'
import { resultsBlock } from '@/sanity/schema-types/blocks/results-block'
import { richTextBlock } from '@/sanity/schema-types/blocks/rich-text-block'
import { servicesBlock } from '@/sanity/schema-types/blocks/services-block'
import { statsBlock } from '@/sanity/schema-types/blocks/stats-block'
import { teamBlock } from '@/sanity/schema-types/blocks/team-block'
import { testimonialsBlock } from '@/sanity/schema-types/blocks/testimonials-block'
import { author } from '@/sanity/schema-types/documents/author'
import { caseStudy } from '@/sanity/schema-types/documents/case-study'
import { category } from '@/sanity/schema-types/documents/category'
import { client } from '@/sanity/schema-types/documents/client'
import { page } from '@/sanity/schema-types/documents/page'
import { post } from '@/sanity/schema-types/documents/post'
import { pricingPlan } from '@/sanity/schema-types/documents/pricing-plan'
import { settings } from '@/sanity/schema-types/documents/settings'
import { testimonial } from '@/sanity/schema-types/documents/testimonial'
import { blockOptions } from '@/sanity/schema-types/objects/block-options'
import { cta } from '@/sanity/schema-types/objects/cta'
import { link } from '@/sanity/schema-types/objects/link'
import { seo } from '@/sanity/schema-types/objects/seo'

export const schemaTypes: SchemaTypeDefinition[] = [
  settings,
  page,
  caseStudy,
  post,
  author,
  category,
  testimonial,
  client,
  pricingPlan,
  seo,
  link,
  cta,
  blockOptions,
  heroBlock,
  featureColumnsBlock,
  bentoGridBlock,
  resultsBlock,
  logoCloudBlock,
  statsBlock,
  testimonialsBlock,
  pricingBlock,
  faqBlock,
  ctaBlock,
  richTextBlock,
  contactFormBlock,
  servicesBlock,
  processBlock,
  teamBlock,
  latestPostsBlock,
]
