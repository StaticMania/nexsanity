type ImageLoaderInput = {
  src: string
  width: number
  quality?: number
}

const sanityCdnHost = 'cdn.sanity.io'

export default function sanityImageLoader({ src, width, quality }: ImageLoaderInput): string {
  const url = new URL(src, 'http://localhost')
  if (url.hostname !== sanityCdnHost) return `${src}?w=${width}`

  const sourceWidth = Number(url.searchParams.get('w'))
  const sourceHeight = Number(url.searchParams.get('h'))
  url.searchParams.set('w', String(width))
  if (sourceWidth > 0 && sourceHeight > 0) {
    url.searchParams.set('h', String(Math.round((width * sourceHeight) / sourceWidth)))
  }
  url.searchParams.set('q', String(quality ?? 80))
  return url.toString()
}
