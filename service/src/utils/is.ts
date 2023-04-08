export function isNotEmptyString(value: any): boolean {
  return typeof value === 'string' && value.length > 0
}
