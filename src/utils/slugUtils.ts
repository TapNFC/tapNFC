/**
 * Generates a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Ensures a slug is unique by appending a number if necessary
 * @param baseSlug - The base slug to check
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let finalSlug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
}
