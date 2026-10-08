import Link from 'next/link'

import { cn } from '@/lib/cn'

import type { CategorySummary } from '@/types/content'

type CategoryFilterProps = {
  categories: readonly CategorySummary[]
  activeSlug: string | null
}

const filterLinkClassName = 'inline-flex rounded-full border px-4 py-2 text-sm transition-colors'

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  if (categories.length === 0) return null

  return (
    <nav aria-label="Categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/blog"
            aria-current={activeSlug === null ? 'page' : undefined}
            className={cn(
              filterLinkClassName,
              activeSlug === null
                ? 'border-ink bg-ink text-canvas'
                : 'border-line hover:border-ink',
            )}
          >
            All posts
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              href={`/blog/category/${category.slug}`}
              aria-current={activeSlug === category.slug ? 'page' : undefined}
              className={cn(
                filterLinkClassName,
                activeSlug === category.slug
                  ? 'border-ink bg-ink text-canvas'
                  : 'border-line hover:border-ink',
              )}
            >
              {category.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
