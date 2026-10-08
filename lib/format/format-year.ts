export function formatYear(isoDate: string): string {
  return String(new Date(isoDate).getUTCFullYear())
}
