import Link from 'next/link'

import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { resolveLinkHref } from '@/lib/sanity/resolve-link-href'

import { CubeRollList } from '@/components/tweenui/cube-roll-list'

import type { BlockOfType } from '@/types/content'

type ServicesBlockProps = {
  block: BlockOfType<'servicesBlock'>
  headingLevel: HeadingLevel
}

export function ServicesBlock({ block, headingLevel: HeadingTag }: ServicesBlockProps) {
  const entries = block.services.map((service) => ({
    key: service._key,
    title: service.title,
    label: service.label,
    href: resolveLinkHref(service.link) ?? '/',
  }))

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <HeadingTag
            id={`${block._key}-heading`}
            className="max-w-2xl text-headline font-medium text-balance"
          >
            {block.heading}
          </HeadingTag>
          {block.intro && <p className="max-w-md text-lg text-pretty opacity-70">{block.intro}</p>}
        </div>
        {isAnimatedBlock(block.blockOptions) ? (
          <CubeRollList entries={entries} label={block.heading} />
        ) : (
          <nav aria-label={block.heading}>
            <ul className="border-t border-current/15">
              {entries.map((entry, index) => (
                <li key={entry.key} className="border-b border-current/15">
                  <Link
                    href={entry.href}
                    className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3 py-5 transition-colors hover:bg-surface md:grid-cols-4 md:gap-4 md:py-6"
                  >
                    <span className="text-xs text-accent tabular-nums">
                      {String(index + 1).padStart(3, '0')}
                    </span>
                    <span className="min-w-0 truncate text-center font-serif text-2xl sm:text-3xl md:col-span-2 md:text-4xl">
                      {entry.title}
                    </span>
                    {entry.label && (
                      <span className="hidden text-right text-sm opacity-70 md:block">
                        {entry.label}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}
