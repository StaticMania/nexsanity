export const POSTS_PER_PAGE = 9
export const CASE_STUDIES_PER_PAGE = 6

export type Pagination = {
  currentPage: number
  totalPages: number
}

export type PageRange = {
  start: number
  end: number
}

export function toPageRange(page: number, perPage: number): PageRange {
  const start = (page - 1) * perPage
  return { start, end: start + perPage }
}

export function buildPagination(page: number, total: number, perPage: number): Pagination {
  return { currentPage: page, totalPages: Math.max(1, Math.ceil(total / perPage)) }
}

export function isPageInRange(page: number, total: number, perPage: number): boolean {
  return page === 1 || page <= Math.ceil(total / perPage)
}
