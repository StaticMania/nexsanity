import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from 'next-sanity'
import type { PortableTextComponents } from 'next-sanity'

import { buildHeadingId } from '@/lib/content/build-table-of-contents'
import { readPortableTextImage } from '@/lib/sanity/read-portable-text-image'
import { readPortableTextLinkHref } from '@/lib/sanity/read-portable-text-link'
import { isExternalHref } from '@/lib/ui/is-external-href'

type PortableTextBodyProps = {
  value: ReadonlyArray<{ _type: string; _key: string }>
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-6 leading-relaxed text-pretty">{children}</p>,
    h2: ({ children, value }) => (
      <h2
        id={buildHeadingId(value)}
        className="mt-14 scroll-mt-32 text-3xl font-medium tracking-tight text-balance"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-2xl font-medium tracking-tight text-balance">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-10 border-l-2 border-accent pl-6 font-serif text-3xl leading-snug italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-6 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mt-6 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-base">{children}</code>
    ),
    link: ({ value, children }) => {
      const href = readPortableTextLinkHref(value)
      if (!href) return <>{children}</>
      const isExternal = isExternalHref(href)
      return (
        <Link
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current"
        >
          {children}
        </Link>
      )
    },
  },
  types: {
    inlineImage: ({ value }) => {
      const portableTextImage = readPortableTextImage(value)
      if (!portableTextImage) return null
      return (
        <figure className="my-12">
          <Image
            {...portableTextImage.image}
            alt={portableTextImage.image.alt}
            sizes="(min-width: 1024px) 860px, 100vw"
            className="aspect-16/9 max-h-cover w-full rounded-card object-cover"
          />
          {portableTextImage.caption && (
            <figcaption className="mt-3 text-sm text-muted">{portableTextImage.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
}

export function PortableTextBody({ value }: PortableTextBodyProps) {
  return (
    <div className="text-lg *:first:mt-0">
      <PortableText value={[...value]} components={portableTextComponents} />
    </div>
  )
}
