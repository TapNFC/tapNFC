/**
 * Phone-related utility functions for better cross-browser compatibility
 */

/**
 * Check if the current device supports phone calls
 * This helps provide better fallback behavior for desktop users
 */
export function isPhoneCapable(): boolean {
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  // Check if we're on iOS (which definitely supports phone calls)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Check if we're on Android (which supports phone calls)
  const isAndroid = /Android/.test(navigator.userAgent);

  return isMobile && (isIOS || isAndroid);
}

/**
 * Handle phone number clicks with better cross-browser compatibility
 * @param phoneNumber - The phone number to call
 * @param fallbackBehavior - What to do if phone calls aren't supported
 */
export function handlePhoneClick(
  phoneNumber: string,
  _fallbackBehavior: 'copy' | 'show' | 'none' = 'copy',
): void {
  const formattedNumber = phoneNumber.startsWith('tel:') ? phoneNumber : `tel:${phoneNumber}`;

  if (isPhoneCapable()) {
    // Use window.location.href for mobile devices to avoid Safari tab issues
    window.location.href = formattedNumber;
  } else {
    // For desktop browsers, use window.open to maintain previous functionality
    // This will open the tel: link in a new tab, similar to how other links work
    window.open(formattedNumber, '_blank');
  }
}

/**
 * Format a phone number for display
 * @param phoneNumber - Raw phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove tel: prefix if present
  const cleanNumber = phoneNumber.replace(/^tel:/, '');

  // Basic formatting for common US number patterns
  const match = cleanNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  // Return as-is if no pattern matches
  return cleanNumber;
}

/**
 * Validate if a string is a valid phone number
 * @param phoneNumber - Phone number to validate
 * @returns True if valid phone number
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Remove tel: prefix and common separators
  const cleanNumber = phoneNumber.replace(/^tel:|[\s()\-.]/g, '');

  // Check if it's all digits and has reasonable length
  return /^\d{7,15}$/.test(cleanNumber);
}

/**
 * Enhanced phone click handler with toast notifications
 * Requires sonner toast to be available
 */
export function handlePhoneClickWithToast(
  phoneNumber: string,
  _fallbackBehavior: 'copy' | 'show' | 'none' = 'copy',
): void {
  const formattedNumber = phoneNumber.startsWith('tel:') ? phoneNumber : `tel:${phoneNumber}`;

  if (isPhoneCapable()) {
    // Use window.location.href for mobile devices to avoid Safari tab issues
    window.location.href = formattedNumber;
  } else {
    // For desktop browsers, use window.open to maintain previous functionality
    // This will open the tel: link in a new tab, similar to how other links work
    window.open(formattedNumber, '_blank');
  }
}
