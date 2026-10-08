import type { Pagination as PaginationData } from '@/lib/content/pagination'

import { CaseStudyCard } from '@/components/customers/case-study-card'
import { Pagination } from '@/components/ui/pagination'

import type { CaseStudyCard as CaseStudyCardData } from '@/types/content'

type CustomersIndexProps = {
  caseStudies: readonly CaseStudyCardData[]
  pagination: PaginationData
}

export function CustomersIndex({ caseStudies, pagination }: CustomersIndexProps) {
  return (
    <section aria-labelledby="customers-heading" className="pt-16 pb-28 md:pt-24">
      <div className="main-container">
        <div className="max-w-3xl border-b border-line pb-10">
          <h1 id="customers-heading" className="text-display font-medium">
            Customer stories
          </h1>
          <p className="mt-5 text-lg text-pretty text-muted">
            How ambitious teams use our work to launch faster, convert better and grow.
          </p>
        </div>
        {caseStudies.length === 0 && (
          <p className="mt-16 text-lg text-muted">No customer stories yet. Check back soon.</p>
        )}
        <ul className="mt-16 grid gap-x-8 gap-y-20 md:grid-cols-2">
          {caseStudies.map((caseStudy) => (
            <li key={caseStudy._id}>
              <CaseStudyCard caseStudy={caseStudy} headingLevel="h2" />
            </li>
          ))}
        </ul>
        <Pagination pagination={pagination} basePath="/customers" />
      </div>
    </section>
  )
}
