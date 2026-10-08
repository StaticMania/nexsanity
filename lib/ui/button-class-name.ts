import { cn } from '@/lib/cn'

export const buttonIntents = ['primary', 'secondary', 'inverse', 'ghost'] as const
export const buttonSizes = ['small', 'medium', 'large'] as const

export type ButtonIntent = (typeof buttonIntents)[number]
export type ButtonSize = (typeof buttonSizes)[number]

type ButtonClassNameOptions = {
  intent?: ButtonIntent
  size?: ButtonSize
  hasArrow?: boolean
  className?: string
}

type ButtonArrowClassNameOptions = {
  intent?: ButtonIntent
  size?: ButtonSize
}

const intentClassNames = {
  primary: 'bg-ink text-canvas hover:bg-ink/85',
  secondary: 'bg-transparent text-ink ring-1 ring-ink/15 ring-inset hover:ring-ink/40',
  inverse: 'bg-inverse-ink text-inverse hover:bg-inverse-ink/90',
  ghost: 'text-ink underline-offset-4 hover:underline',
} as const satisfies Record<ButtonIntent, string>

const sizeClassNames = {
  small: 'h-10 px-4 text-sm',
  medium: 'h-11 px-5 text-sm',
  large: 'h-12 px-6 text-base',
} as const satisfies Record<ButtonSize, string>

const arrowPaddingClassNames = {
  small: 'pr-1',
  medium: 'pr-1.5',
  large: 'pr-1.5',
} as const satisfies Record<ButtonSize, string>

const arrowIntentClassNames = {
  primary: 'bg-canvas/15 text-canvas group-hover/button:bg-canvas group-hover/button:text-ink',
  secondary: 'bg-ink text-canvas group-hover/button:bg-accent group-hover/button:text-accent-ink',
  inverse:
    'bg-inverse/10 text-inverse group-hover/button:bg-inverse group-hover/button:text-inverse-ink',
  ghost: 'text-ink',
} as const satisfies Record<ButtonIntent, string>

const arrowSizeClassNames = {
  small: 'size-8',
  medium: 'size-8',
  large: 'size-9',
} as const satisfies Record<ButtonSize, string>

export function buttonClassName({
  intent = 'primary',
  size = 'medium',
  hasArrow = false,
  className,
}: ButtonClassNameOptions = {}): string {
  return cn(
    'group/button inline-flex items-center justify-center gap-3 rounded-full font-medium whitespace-nowrap transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50',
    intentClassNames[intent],
    sizeClassNames[size],
    hasArrow && arrowPaddingClassNames[size],
    className,
  )
}

export const buttonArrowIconClassName =
  'size-4 transition-transform duration-300 group-hover/button:-rotate-45'

export function buttonArrowClassName({
  intent = 'primary',
  size = 'medium',
}: ButtonArrowClassNameOptions = {}): string {
  return cn(
    'grid shrink-0 place-items-center rounded-full transition-colors duration-300',
    arrowIntentClassNames[intent],
    arrowSizeClassNames[size],
  )
}
