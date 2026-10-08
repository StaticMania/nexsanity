import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { buildPaginationLinks } from '@/lib/content/build-pagination-links'
import type { Pagination as PaginationData } from '@/lib/content/pagination'

type PaginationProps = {
  pagination: PaginationData
  basePath: string
}

const pageLinkClassName =
  'inline-flex size-11 items-center justify-center rounded-full text-sm transition-colors'

export function Pagination({ pagination, basePath }: PaginationProps) {
  if (pagination.totalPages <= 1) return null
  const { previousHref, nextHref, pages } = buildPaginationLinks(pagination, basePath)

  return (
    <nav aria-label="Pagination" className="mt-20 flex items-center justify-center gap-2">
      {previousHref && (
        <Link
          href={previousHref}
          aria-label="Previous page"
          className={cn(pageLinkClassName, 'border border-line hover:bg-surface')}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
      )}
      <ol className="flex items-center gap-1">
        {pages.map(({ page, href, isCurrent }) => (
          <li key={page}>
            <Link
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={`Page ${page}`}
              className={cn(
                pageLinkClassName,
                isCurrent ? 'bg-ink text-canvas' : 'hover:bg-surface',
              )}
            >
              {page}
            </Link>
          </li>
        ))}
      </ol>
      {nextHref && (
        <Link
          href={nextHref}
          aria-label="Next page"
          className={cn(pageLinkClassName, 'border border-line hover:bg-surface')}
        >
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      )}
    </nav>
  )
}
