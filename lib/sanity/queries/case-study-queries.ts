import { defineQuery } from 'next-sanity'

import {
  caseStudyCardFragment,
  imageFields,
  imageFragment,
  portableTextFragment,
  testimonialFragment,
} from '@/lib/sanity/queries/fragments'

const publishedCaseStudyFilter = `_type == "caseStudy" && defined(slug.current)`

export const caseStudiesPageQuery = defineQuery(`{
  "caseStudies": *[${publishedCaseStudyFilter}]
    | order(publishedAt desc) [$start...$end] ${caseStudyCardFragment},
  "total": count(*[${publishedCaseStudyFilter}])
}`)

export const caseStudyBySlugQuery =
  defineQuery(`*[${publishedCaseStudyFilter} && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  coverImage ${imageFragment},
  client->{ name, websiteUrl, logo ${imageFragment} },
  industry,
  services,
  duration,
  metrics[]{ _key, value, label },
  body[] ${portableTextFragment},
  gallery[]{ _key, ${imageFields} },
  "previousCaseStudy": *[${publishedCaseStudyFilter} && publishedAt < ^.publishedAt] | order(publishedAt desc) [0]{ title, "slug": slug.current },
  "nextCaseStudy": *[${publishedCaseStudyFilter} && publishedAt > ^.publishedAt] | order(publishedAt asc) [0]{ title, "slug": slug.current },
  "relatedCaseStudies": *[${publishedCaseStudyFilter} && _id != ^._id] | order(publishedAt desc) [0...3] ${caseStudyCardFragment},
  testimonial-> ${testimonialFragment}
}`)

export const caseStudySlugsQuery = defineQuery(
  `*[${publishedCaseStudyFilter}] | order(publishedAt desc) [0...100]{ "slug": slug.current }`,
)
