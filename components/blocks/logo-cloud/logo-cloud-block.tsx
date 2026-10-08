import Image from 'next/image'

import { cn } from '@/lib/cn'
import { buildSectionClassName, isAnimatedBlock, isDarkBlock } from '@/lib/content/block-options'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import { LogoCycle } from '@/components/tweenui/logo-cycle'

import type { BlockOfType } from '@/types/content'

type LogoCloudBlockProps = {
  block: BlockOfType<'logoCloudBlock'>
  headingLevel: HeadingLevel
}

export function LogoCloudBlock({ block, headingLevel: HeadingTag }: LogoCloudBlockProps) {
  const isAnimated = isAnimatedBlock(block.blockOptions)
  const logos = block.clients.flatMap((client) => {
    const logo = buildImageProps(client.logo, { width: 320 })
    return logo ? [{ key: client._id, name: client.name, logo }] : []
  })
  const logoClassName = cn(
    'h-8 w-auto object-contain opacity-70',
    isDarkBlock(block.blockOptions) && 'invert',
  )

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <HeadingTag
          id={`${block._key}-heading`}
          className="text-center text-sm font-normal tracking-wide uppercase opacity-60"
        >
          {block.heading}
        </HeadingTag>
        {isAnimated ? (
          <>
            <ul className="sr-only">
              {logos.map(({ key, name }) => (
                <li key={key}>{name}</li>
              ))}
            </ul>
            <LogoCycle logos={logos} isOnDark={isDarkBlock(block.blockOptions)} />
          </>
        ) : (
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
            {logos.map(({ key, name, logo }) => (
              <li key={key}>
                <Image {...logo} alt={name} sizes="160px" className={logoClassName} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
