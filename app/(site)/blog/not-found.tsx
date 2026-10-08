import { RouteNotFound } from '@/components/site/route-not-found'

export default function NotFound() {
  return <RouteNotFound heading="Post not found" backHref="/blog" backLabel="Back to the blog" />
}
