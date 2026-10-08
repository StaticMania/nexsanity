'use client'

import { RouteError } from '@/components/site/route-error'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <RouteError error={error} onRetry={reset} />
}
