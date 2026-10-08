import { RouteNotFound } from '@/components/site/route-not-found'

export default function NotFound() {
  return <RouteNotFound heading="Page not found" backHref="/" backLabel="Go to Home" />
}
