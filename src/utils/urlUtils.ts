/**
 * Utility function to extract simple URL from preview URL
 * Converts URLs like "http://localhost:3000/en/preview/demodesign" to "http://localhost:3000/demodesign"
 */
export const getSimpleUrl = (fullUrl: string): string => {
  try {
    const url = new URL(fullUrl);
    const pathParts = url.pathname.split('/');
    // Extract the last part of the path (the identifier)
    const identifier = pathParts[pathParts.length - 1];
    // Construct the simplified URL
    return `${url.origin}/${identifier}`;
  } catch {
    // Fallback: try to extract from pathname directly
    const pathParts = fullUrl.split('/');
    const identifier = pathParts[pathParts.length - 1];
    // Try to extract origin from the full URL
    const origin = fullUrl.split('/').slice(0, 3).join('/');
    return `${origin}/${identifier}`;
  }
};
