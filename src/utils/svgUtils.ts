/**
 * Utility functions for SVG operations
 */

/**
 * Extract all fill colors from SVG code with their positions
 * @param svgCode - The SVG code as a string
 * @returns Array of objects containing color value and position information
 */
export function extractSvgFillColors(svgCode: string): Array<{ color: string; index: number; originalIndex: number }> {
  const colors: Array<{ color: string; index: number; originalIndex: number }> = [];
  let index = 0;

  // Regular expression to match fill attributes with various color formats
  // This handles: fill="#FFC107", fill="red", fill="rgb(255,0,0)", etc.
  const fillRegex = /fill=["']([^"']+)["']/g;
  let match = fillRegex.exec(svgCode);

  while (match !== null) {
    const color = match[1];
    // Skip transparent, none, and empty values, but allow duplicates
    if (color && color !== 'transparent' && color !== 'none' && color !== '') {
      colors.push({
        color,
        index: colors.length, // Sequential index for the UI
        originalIndex: index, // Original position in the SVG
      });
    }
    index++;
    match = fillRegex.exec(svgCode);
  }

  return colors;
}

/**
 * Replace fill colors in SVG code by position
 * @param svgCode - The original SVG code
 * @param colorMap - Map of position indices to new colors
 * @returns Modified SVG code with new colors
 */
export function replaceSvgFillColors(svgCode: string, colorMap: Record<number, string>): string {
  let modifiedSvg = svgCode;
  let currentIndex = 0;

  // Find all fill attributes and replace them based on their position
  const fillRegex = /fill=["']([^"']+)["']/g;
  let match = fillRegex.exec(modifiedSvg);

  while (match !== null) {
    const color = match[1];
    // Skip transparent, none, and empty values
    if (color && color !== 'transparent' && color !== 'none' && color !== '') {
      // Check if we have a new color for this position
      if (colorMap[currentIndex] !== undefined) {
        const newColor = colorMap[currentIndex];
        // Replace this specific instance of the color
        const beforeMatch = modifiedSvg.substring(0, match.index);
        const afterMatch = modifiedSvg.substring(match.index + match[0].length);
        modifiedSvg = `${beforeMatch}fill="${newColor}"${afterMatch}`;

        // Adjust the regex index since we modified the string
        fillRegex.lastIndex = match.index + `fill="${newColor}"`.length;
      }
      currentIndex++;
    }
    match = fillRegex.exec(modifiedSvg);
  }

  return modifiedSvg;
}

/**
 * Parse SVG code to get path information
 * @param svgCode - The SVG code as a string
 * @returns Array of path objects with fill colors
 */
export function parseSvgPaths(svgCode: string): Array<{ path: string; fill: string }> {
  const paths: Array<{ path: string; fill: string }> = [];

  // Regular expression to match path elements with fill attributes
  const pathRegex = /<path[^>]*fill=["']([^"']*)["'][^>]*d=["']([^"']*)["'][^>]*>/g;
  let match = pathRegex.exec(svgCode);

  while (match !== null) {
    const fill = match[1];
    const path = match[2];

    if (path && fill && fill !== 'transparent' && fill !== 'none') {
      paths.push({ path, fill });
    }
    match = pathRegex.exec(svgCode);
  }

  return paths;
}
