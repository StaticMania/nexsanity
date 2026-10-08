import type { Pagination as PaginationData } from '@/lib/content/pagination'

import { CategoryFilter } from '@/components/blog/category-filter'
import { PostCard } from '@/components/blog/post-card'
import { Pagination } from '@/components/ui/pagination'

import type { CategorySummary, PostCard as PostCardData } from '@/types/content'

type BlogIndexProps = {
  heading: string
  intro: string | null
  posts: readonly PostCardData[]
  categories: readonly CategorySummary[]
  activeCategorySlug: string | null
  pagination: PaginationData
  basePath: string
}

export function BlogIndex({
  heading,
  intro,
  posts,
  categories,
  activeCategorySlug,
  pagination,
  basePath,
}: BlogIndexProps) {
  const isFirstPage = pagination.currentPage === 1
  const [featuredPost, ...remainingPosts] = posts
  const shouldFeaturePost = isFirstPage && activeCategorySlug === null && featuredPost
  const gridPosts = shouldFeaturePost ? remainingPosts : posts

  return (
    <section aria-labelledby="blog-heading" className="pt-16 pb-28 md:pt-24">
      <div className="main-container">
        <div className="flex flex-col justify-between gap-8 border-b border-line pb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h1 id="blog-heading" className="text-display font-medium">
              {heading}
            </h1>
            {intro && <p className="mt-5 text-lg text-pretty text-muted">{intro}</p>}
          </div>
          <CategoryFilter categories={categories} activeSlug={activeCategorySlug} />
        </div>
        {posts.length === 0 && (
          <p className="mt-16 text-lg text-muted">No posts yet. Check back soon.</p>
        )}
        {shouldFeaturePost && (
          <div className="mt-16">
            <PostCard post={featuredPost} headingLevel="h2" isFeatured />
          </div>
        )}
        {gridPosts.length > 0 && (
          <ul className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <li key={post._id}>
                <PostCard post={post} headingLevel="h2" />
              </li>
            ))}
          </ul>
        )}
        <Pagination pagination={pagination} basePath={basePath} />
      </div>
    </section>
  )
}
