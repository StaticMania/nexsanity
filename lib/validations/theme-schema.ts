import { stegaClean } from 'next-sanity'
import { z } from 'zod'

const hexColorSchema = z
  .string()
  .regex(/^#(?:[\da-f]{3}){1,2}$/i)
  .optional()
  .catch(undefined)

export const themeSchema = z.object({
  colorScheme: z.enum(['light', 'dark', 'system']).catch('light'),
  backgroundColor: hexColorSchema,
  surfaceColor: hexColorSchema,
  accentColor: hexColorSchema,
  foregroundColor: hexColorSchema,
})

export const cleanThemeSchema = z.preprocess((value) => stegaClean(value ?? {}), themeSchema)

export type Theme = z.infer<typeof themeSchema>
