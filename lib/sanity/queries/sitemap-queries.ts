import { defineQuery } from 'next-sanity'

export const sitemapQuery = defineQuery(`{
  "pages": *[_type == "page" && defined(slug.current) && seo.isIndexable != false]{
    "slug": slug.current,
    _updatedAt
  },
  "posts": *[_type == "post" && defined(slug.current) && seo.isIndexable != false]{
    "slug": slug.current,
    _updatedAt
  },
  "caseStudies": *[_type == "caseStudy" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  },
  "categories": *[_type == "category" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
}`)
