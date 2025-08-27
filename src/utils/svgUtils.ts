/**
 * Utility functions for SVG operations
 */

/**
 * Extract all fill colors from SVG code
 * @param svgCode - The SVG code as a string
 * @returns Array of unique fill colors found in the SVG
 */
export function extractSvgFillColors(svgCode: string): string[] {
  const colors: string[] = [];

  // Regular expression to match fill attributes with various color formats
  // This handles: fill="#FFC107", fill="red", fill="rgb(255,0,0)", etc.
  const fillRegex = /fill=["']([^"']+)["']/g;
  let match = fillRegex.exec(svgCode);

  while (match !== null) {
    const color = match[1];
    // Skip transparent, none, and empty values
    if (color && color !== 'transparent' && color !== 'none' && color !== '' && !colors.includes(color)) {
      colors.push(color);
    }
    match = fillRegex.exec(svgCode);
  }

  return colors;
}

/**
 * Replace fill colors in SVG code
 * @param svgCode - The original SVG code
 * @param colorMap - Map of old colors to new colors
 * @returns Modified SVG code with new colors
 */
export function replaceSvgFillColors(svgCode: string, colorMap: Record<string, string>): string {
  let modifiedSvg = svgCode;

  Object.entries(colorMap).forEach(([oldColor, newColor]) => {
    // Use a more robust regex that handles quotes properly
    const regex = new RegExp(`fill=["']${oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    modifiedSvg = modifiedSvg.replace(regex, `fill="${newColor}"`);
  });

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
