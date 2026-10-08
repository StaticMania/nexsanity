import { publicEnv } from '@/lib/env/public-env'

export type ShareLink = {
  key: string
  label: string
  href: string
}

export function buildShareLinks(path: string, title: string): ShareLink[] {
  const pageUrl = encodeURIComponent(new URL(path, publicEnv.siteUrl).toString())
  const encodedTitle = encodeURIComponent(title)

  return [
    {
      key: 'x',
      label: 'Share on X',
      href: `https://x.com/intent/post?url=${pageUrl}&text=${encodedTitle}`,
    },
    {
      key: 'linkedin',
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
    },
  ]
}
