export type HeadingLevel = 'h1' | 'h2'
export type SubheadingLevel = 'h2' | 'h3'

export function toHeadingLevel(blockIndex: number): HeadingLevel {
  return blockIndex === 0 ? 'h1' : 'h2'
}

export function toSubheadingLevel(headingLevel: HeadingLevel): SubheadingLevel {
  return headingLevel === 'h1' ? 'h2' : 'h3'
}
