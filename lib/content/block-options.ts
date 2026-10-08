import { stegaClean } from 'next-sanity'

import { cn } from '@/lib/cn'

type BlockOptions = {
  background: string | null
  spacing: string | null
  hasAnimation: boolean | null
} | null

const backgroundClassNames = {
  light: 'bg-canvas text-ink',
  muted: 'bg-surface text-ink',
  dark: 'bg-inverse text-inverse-ink',
} as const

const spacingClassNames = {
  tight: 'py-6 md:py-8',
  compact: 'py-12 md:py-16',
  default: 'py-20 md:py-28',
  spacious: 'py-28 md:py-40',
} as const

export function buildSectionClassName(blockOptions: BlockOptions, className?: string): string {
  const background = readOption(backgroundClassNames, blockOptions?.background, 'light')
  const spacing = readOption(spacingClassNames, blockOptions?.spacing, 'default')
  return cn(backgroundClassNames[background], spacingClassNames[spacing], className)
}

export function isDarkBlock(blockOptions: BlockOptions): boolean {
  return stegaClean(blockOptions?.background) === 'dark'
}

export function isAnimatedBlock(blockOptions: BlockOptions): boolean {
  return blockOptions?.hasAnimation !== false
}

function readOption<Options extends Record<string, string>>(
  options: Options,
  value: string | null | undefined,
  fallback: keyof Options,
): keyof Options {
  const cleanValue = stegaClean(value)
  return cleanValue && isOptionKey(options, cleanValue) ? cleanValue : fallback
}

function isOptionKey<Options extends Record<string, string>>(
  options: Options,
  key: string,
): key is Extract<keyof Options, string> {
  return Object.hasOwn(options, key)
}
