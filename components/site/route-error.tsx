'use client'

import { RotateCcw } from 'lucide-react'
import { useEffect } from 'react'

import { buttonClassName } from '@/lib/ui/button-class-name'

import { ButtonLink } from '@/components/ui/button-link'

type RouteErrorProps = {
  error: Error & { digest?: string }
  onRetry: () => void
}

export function RouteError({ error, onRetry }: RouteErrorProps) {
  useEffect(() => {
    console.error({ route: 'error-boundary', digest: error.digest })
  }, [error])

  return (
    <section aria-labelledby="route-error-heading" className="py-32">
      <div className="main-container">
        <div className="mx-auto max-w-xl text-center">
          <h1 id="route-error-heading" className="text-headline font-medium text-balance">
            Something went wrong
          </h1>
          <p className="mt-5 text-lg text-muted">
            We could not load this page. Please try again in a moment.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onRetry} className={buttonClassName({ size: 'large' })}>
              <RotateCcw aria-hidden="true" className="size-4" />
              Try again
            </button>
            <ButtonLink href="/" intent="secondary" size="large">
              Go home
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
