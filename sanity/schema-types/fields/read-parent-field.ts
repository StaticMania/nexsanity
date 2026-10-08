export function readParentField(parent: unknown, fieldName: string): unknown {
  if (typeof parent !== 'object' || parent === null) return undefined
  return Object.getOwnPropertyDescriptor(parent, fieldName)?.value
}
