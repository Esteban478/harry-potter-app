/**
 * Returns the ordinal suffix for a given number.
 * @param n - The number to get the ordinal suffix for.
 * @returns The ordinal suffix as a string.
 */
export const getOrdinalSuffix = (n: number): string => {
  const s: string[] = ['th', 'st', 'nd', 'rd'];
  const v: number = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}