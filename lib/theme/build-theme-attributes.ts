import type { CSSProperties } from 'react'

import { cleanThemeSchema } from '@/lib/validations/theme-schema'

type CssVariables = { [variable: `--${string}`]: string }

export type ThemeAttributes = {
  'data-theme': 'light' | 'dark' | 'system'
  style: CSSProperties & CssVariables
}

export function buildThemeAttributes(theme: unknown): ThemeAttributes {
  const { colorScheme, backgroundColor, surfaceColor, accentColor, foregroundColor } =
    cleanThemeSchema.parse(theme)

  const variables: CssVariables = {}
  if (backgroundColor) variables['--theme-canvas'] = backgroundColor
  if (surfaceColor) variables['--theme-surface'] = surfaceColor
  if (accentColor) variables['--theme-accent'] = accentColor
  if (foregroundColor) {
    variables['--theme-ink'] = foregroundColor
    variables['--theme-inverse'] = foregroundColor
  }

  return { 'data-theme': colorScheme, style: variables }
}
