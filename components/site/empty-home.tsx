import { ButtonLink } from '@/components/ui/button-link'

export function EmptyHome() {
  return (
    <section aria-labelledby="empty-home-heading" className="py-32">
      <div className="main-container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 id="empty-home-heading" className="text-headline font-medium text-balance">
            <span className="block font-serif italic">Almost there,</span>
            your site is ready for content.
          </h1>
          <p className="mt-6 text-lg text-pretty text-muted">
            Open the Studio and create a page with the slug “home”, or import the demo content with{' '}
            <code className="rounded bg-surface px-1.5 py-0.5">pnpm seed:import</code>.
          </p>
          <ButtonLink href="/studio" size="large" className="mt-10">
            Open the Studio
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
