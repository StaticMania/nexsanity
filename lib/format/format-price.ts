const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatPriceCents(priceCents: number): string {
  return priceFormatter.format(priceCents / 100)
}
