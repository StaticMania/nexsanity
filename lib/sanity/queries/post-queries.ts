import { defineQuery } from 'next-sanity'

import {
  imageFragment,
  portableTextFragment,
  postCardFragment,
  seoFragment,
} from '@/lib/sanity/queries/fragments'

const publishedPostFilter = `_type == "post" && defined(slug.current)`

export const postsPageQuery = defineQuery(`{
  "posts": *[${publishedPostFilter}] | order(publishedAt desc) [$start...$end] ${postCardFragment},
  "total": count(*[${publishedPostFilter}])
}`)

export const categoryPostsPageQuery = defineQuery(`{
  "category": *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description
  },
  "posts": *[${publishedPostFilter} && $slug in categories[]->slug.current]
    | order(publishedAt desc) [$start...$end] ${postCardFragment},
  "total": count(*[${publishedPostFilter} && $slug in categories[]->slug.current])
}`)

export const categoriesQuery = defineQuery(
  `*[_type == "category" && defined(slug.current)] | order(title asc){ _id, title, "slug": slug.current }`,
)

export const postBySlugQuery = defineQuery(`*[${publishedPostFilter} && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage ${imageFragment},
  body[] ${portableTextFragment},
  author->{ name, role, bio, avatar ${imageFragment} },
  categories[]->{ _id, title, "slug": slug.current },
  seo ${seoFragment},
  "readingTimeMinutes": round(length(pt::text(body)) / 5 / 200),
  "previousPost": *[${publishedPostFilter} && publishedAt < ^.publishedAt] | order(publishedAt desc) [0]{ title, "slug": slug.current },
  "nextPost": *[${publishedPostFilter} && publishedAt > ^.publishedAt] | order(publishedAt asc) [0]{ title, "slug": slug.current },
  "relatedPosts": *[
    ${publishedPostFilter}
    && _id != ^._id
    && count(categories[@._ref in ^.^.categories[]._ref]) > 0
  ] | order(publishedAt desc) [0...3] ${postCardFragment}
}`)

export const postSlugsQuery = defineQuery(
  `*[${publishedPostFilter}] | order(publishedAt desc) [0...100]{ "slug": slug.current }`,
)

export const categorySlugsQuery = defineQuery(
  `*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`,
)
