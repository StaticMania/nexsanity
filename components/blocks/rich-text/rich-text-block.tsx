import { buildSectionClassName } from '@/lib/content/block-options'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import { PortableTextBody } from '@/components/portable-text/portable-text-body'

import type { BlockOfType } from '@/types/content'

type RichTextBlockProps = {
  block: BlockOfType<'richTextBlock'>
  headingLevel: HeadingLevel
}

export function RichTextBlock({ block, headingLevel: HeadingTag }: RichTextBlockProps) {
  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="mx-auto max-w-article">
          <HeadingTag
            id={`${block._key}-heading`}
            className="text-headline font-medium text-balance"
          >
            {block.heading}
          </HeadingTag>
          <div className="mt-10">
            <PortableTextBody value={block.body} />
          </div>
        </div>
      </div>
    </section>
  )
}
