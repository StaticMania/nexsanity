import { toHeadingLevel } from '@/lib/content/heading-levels'

import { BentoGridBlock } from '@/components/blocks/bento-grid/bento-grid-block'
import { ContactFormBlock } from '@/components/blocks/contact-form/contact-form-block'
import { CtaBlock } from '@/components/blocks/cta/cta-block'
import { FaqBlock } from '@/components/blocks/faq/faq-block'
import { FeatureColumnsBlock } from '@/components/blocks/feature-columns/feature-columns-block'
import { HeroBlock } from '@/components/blocks/hero/hero-block'
import { LatestPostsBlock } from '@/components/blocks/latest-posts/latest-posts-block'
import { LogoCloudBlock } from '@/components/blocks/logo-cloud/logo-cloud-block'
import { PricingBlock } from '@/components/blocks/pricing/pricing-block'
import { ProcessBlock } from '@/components/blocks/process/process-block'
import { ResultsBlock } from '@/components/blocks/results/results-block'
import { RichTextBlock } from '@/components/blocks/rich-text/rich-text-block'
import { ServicesBlock } from '@/components/blocks/services/services-block'
import { StatsBlock } from '@/components/blocks/stats/stats-block'
import { TeamBlock } from '@/components/blocks/team/team-block'
import { TestimonialsBlock } from '@/components/blocks/testimonials/testimonials-block'

import type { PageBuilderBlock } from '@/types/content'

type PageBuilderProps = {
  blocks: readonly PageBuilderBlock[] | null
}

export function PageBuilder({ blocks }: PageBuilderProps) {
  if (!blocks || blocks.length === 0) return null

  return blocks.map((block, blockIndex) => {
    const headingLevel = toHeadingLevel(blockIndex)

    switch (block._type) {
      case 'heroBlock': {
        return <HeroBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'featureColumnsBlock': {
        return <FeatureColumnsBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'bentoGridBlock': {
        return <BentoGridBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'resultsBlock': {
        return <ResultsBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'logoCloudBlock': {
        return <LogoCloudBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'statsBlock': {
        return <StatsBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'testimonialsBlock': {
        return <TestimonialsBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'pricingBlock': {
        return <PricingBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'faqBlock': {
        return <FaqBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'ctaBlock': {
        return <CtaBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'richTextBlock': {
        return <RichTextBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'contactFormBlock': {
        return <ContactFormBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'servicesBlock': {
        return <ServicesBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'processBlock': {
        return <ProcessBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'teamBlock': {
        return <TeamBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      case 'latestPostsBlock': {
        return <LatestPostsBlock key={block._key} block={block} headingLevel={headingLevel} />
      }
      default: {
        return null
      }
    }
  })
}
