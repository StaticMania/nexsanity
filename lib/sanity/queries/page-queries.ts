import { defineQuery } from 'next-sanity'

import {
  caseStudyCardFragment,
  ctaFragment,
  imageFields,
  imageFragment,
  linkFields,
  portableTextFragment,
  postCardFragment,
  seoFragment,
  testimonialFragment,
} from '@/lib/sanity/queries/fragments'

const blockOptionsFragment = `blockOptions { background, spacing, hasAnimation }`

const pageBuilderFragment = `{
  _key,
  _type,
  ${blockOptionsFragment},
  _type == "heroBlock" => {
    eyebrowLine,
    headline,
    subheadline,
    ctas[] ${ctaFragment},
    carouselImages[]{ _key, ${imageFields} },
    hasAutoScroll,
    layout,
    proofLabel,
    proofAvatars[]{ _key, ${imageFields} },
    floatingStats[]{ _key, value, label, image ${imageFragment} },
    showcaseCards[]{ _key, title, caption, image ${imageFragment} }
  },
  _type == "featureColumnsBlock" => {
    heading,
    isHeadingVisible,
    features[]{ _key, title, description }
  },
  _type == "bentoGridBlock" => {
    heading,
    intro,
    cards[]{ _key, title, text, tone, size, imageStyle, image ${imageFragment} }
  },
  _type == "resultsBlock" => {
    heading,
    intro,
    caseStudies[]-> ${caseStudyCardFragment}
  },
  _type == "logoCloudBlock" => {
    heading,
    clients[]->{ _id, name, websiteUrl, logo ${imageFragment} }
  },
  _type == "statsBlock" => {
    heading,
    stats[]{ _key, value, label }
  },
  _type == "testimonialsBlock" => {
    heading,
    testimonials[]-> ${testimonialFragment}
  },
  _type == "pricingBlock" => {
    heading,
    intro,
    hasBillingToggle,
    plans[]->{
      _id,
      name,
      tagline,
      description,
      monthlyPriceCents,
      yearlyPriceCents,
      features,
      isFeatured,
      cta ${ctaFragment}
    }
  },
  _type == "faqBlock" => {
    heading,
    questions[]{ _key, question, answer }
  },
  _type == "ctaBlock" => {
    heading,
    text,
    ctas[] ${ctaFragment},
    images[]{ _key, ${imageFields} }
  },
  _type == "richTextBlock" => {
    heading,
    body[] ${portableTextFragment}
  },
  _type == "servicesBlock" => {
    heading,
    intro,
    services[]{ _key, title, label, link{ ${linkFields} } }
  },
  _type == "processBlock" => {
    heading,
    intro,
    steps[]{ _key, title, description, image{ ${imageFields} } }
  },
  _type == "teamBlock" => {
    heading,
    intro,
    members[]->{ _id, name, role, avatar ${imageFragment} }
  },
  _type == "latestPostsBlock" => {
    heading,
    intro,
    "posts": select(
      count(posts) > 0 => posts[]-> ${postCardFragment},
      *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...3] ${postCardFragment}
    )
  },
  _type == "contactFormBlock" => {
    heading,
    intro,
    contactDescription,
    contactPhone,
    contactEmail,
    contactAddress,
    successMessage
  }
}`

export const pageBySlugQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  seo ${seoFragment},
  pageBuilder[] ${pageBuilderFragment}
}`)

export const pageSlugsQuery = defineQuery(
  `*[_type == "page" && defined(slug.current) && slug.current != "home"]{ "slug": slug.current }`,
)
