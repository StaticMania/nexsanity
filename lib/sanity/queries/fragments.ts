export const imageFields = `
  alt,
  isDecorative,
  crop,
  hotspot,
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  }
`

export const imageFragment = `{${imageFields}}`

export const linkFields = `
  label,
  linkType,
  externalUrl,
  "internal": internalReference->{ _type, title, "slug": slug.current }
`

export const linkFragment = `{${linkFields}}`

export const ctaFragment = `{
  _key,
  label,
  variant,
  link ${linkFragment}
}`

export const seoFragment = `{
  metaTitle,
  metaDescription,
  isIndexable,
  ogImage ${imageFragment}
}`

export const portableTextFragment = `{
  ...,
  _type == "inlineImage" => {
    _key,
    _type,
    caption,
    alt,
    isDecorative,
    crop,
    hotspot,
    asset->{ _id, url, metadata { lqip, dimensions { width, height } } }
  },
  markDefs[]{
    ...,
    _type == "link" => {
      _key,
      _type,
      linkType,
      externalUrl,
      "internal": internalReference->{ _type, title, "slug": slug.current }
    }
  }
}`

export const postCardFragment = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage ${imageFragment},
  author->{ name, role, avatar ${imageFragment} },
  categories[]->{ _id, title, "slug": slug.current }
}`

export const caseStudyCardFragment = `{
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  coverImage ${imageFragment},
  client->{ name, logo ${imageFragment} },
  metrics[]{ _key, value, label }
}`

export const testimonialFragment = `{
  _id,
  quote,
  authorName,
  authorRole,
  company,
  avatar ${imageFragment}
}`
