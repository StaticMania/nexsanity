import { defineDocuments, defineLocations } from 'sanity/presentation'
import type { PresentationPluginOptions } from 'sanity/presentation'

const homeSlug = 'home'

export const presentationResolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/', filter: `_type == "page" && slug.current == "${homeSlug}"` },
    { route: '/:slug', filter: '_type == "page" && slug.current == $slug' },
    { route: '/blog/:slug', filter: '_type == "post" && slug.current == $slug' },
    { route: '/customers/:slug', filter: '_type == "caseStudy" && slug.current == $slug' },
    { route: '/blog/category/:slug', filter: '_type == "category" && slug.current == $slug' },
  ]),
  locations: {
    settings: defineLocations({
      message: 'Site settings are used on every page',
      tone: 'positive',
      locations: [{ title: 'Home', href: '/' }],
    }),
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title ?? 'Untitled page',
            href: document?.slug === homeSlug ? '/' : `/${document?.slug ?? ''}`,
          },
        ],
      }),
    }),
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (document) => ({
        locations: [
          { title: document?.title ?? 'Untitled post', href: `/blog/${document?.slug ?? ''}` },
          { title: 'Blog', href: '/blog' },
        ],
      }),
    }),
    caseStudy: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title ?? 'Untitled case study',
            href: `/customers/${document?.slug ?? ''}`,
          },
          { title: 'Customers', href: '/customers' },
        ],
      }),
    }),
    category: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title ?? 'Untitled category',
            href: `/blog/category/${document?.slug ?? ''}`,
          },
        ],
      }),
    }),
  },
}
