import type { Pagination } from '@/lib/content/pagination'

export type PageLink = {
  page: number
  href: string
  isCurrent: boolean
}

export type PaginationLinks = {
  previousHref: string | null
  nextHref: string | null
  pages: PageLink[]
}

export function buildPaginationLinks(
  { currentPage, totalPages }: Pagination,
  basePath: string,
): PaginationLinks {
  const toHref = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`)

  return {
    previousHref: currentPage > 1 ? toHref(currentPage - 1) : null,
    nextHref: currentPage < totalPages ? toHref(currentPage + 1) : null,
    pages: Array.from({ length: totalPages }, (_, pageIndex) => {
      const page = pageIndex + 1
      return { page, href: toHref(page), isCurrent: page === currentPage }
    }),
  }
}
