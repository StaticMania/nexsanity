import { slugify } from '@/lib/format/slugify'

type TextBlock = {
  _type: string
  _key: string
  style?: string
  children?: ReadonlyArray<unknown>
}

export type TableOfContentsEntry = {
  id: string
  title: string
}

export function buildTableOfContents(body: readonly TextBlock[]): TableOfContentsEntry[] {
  return body
    .filter((block) => block._type === 'block' && block.style === 'h2')
    .map((block) => {
      const title = readBlockText(block)
      return { id: slugify(title), title }
    })
}

export function buildHeadingId(block: { children?: ReadonlyArray<unknown> }): string {
  return slugify(readBlockText(block))
}

function readBlockText(block: { children?: ReadonlyArray<unknown> }): string {
  return (block.children ?? []).map(readSpanText).join('')
}

function readSpanText(child: unknown): string {
  return typeof child === 'object' &&
    child !== null &&
    'text' in child &&
    typeof child.text === 'string'
    ? child.text
    : ''
}
