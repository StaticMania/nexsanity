import { RouteNotFound } from '@/components/site/route-not-found'

export default function NotFound() {
  return (
    <RouteNotFound
      heading="Story not found"
      backHref="/customers"
      backLabel="All customer stories"
    />
  )
}
