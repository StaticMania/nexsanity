export function isExternalHref(href: string): boolean {
  return /^(?:https?:)?\/\//.test(href)
}
