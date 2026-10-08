export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .trim()
    .replaceAll(/[\s-]+/g, '-')
}
