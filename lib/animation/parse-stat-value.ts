export type ParsedStatValue = {
  prefix: string
  number: number
  suffix: string
  decimals: number
}

const statValuePattern = /^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/

export function parseStatValue(value: string): ParsedStatValue | null {
  const match = statValuePattern.exec(value.trim())
  if (!match) return null

  const [, prefix = '', digits = '', suffix = ''] = match
  const normalizedDigits = digits.replace(',', '.')
  const decimalPart = normalizedDigits.split('.')[1]

  return {
    prefix,
    number: Number(normalizedDigits),
    suffix,
    decimals: decimalPart?.length ?? 0,
  }
}
