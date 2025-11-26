import { z } from 'zod';

// Email validation schema
export const emailValidation = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Phone number validation schema - allows + at beginning, then digits, minimum 7 characters
export const phoneValidation = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\+?\d+$/, 'Phone number must contain only digits with optional + at beginning')
  .min(7, 'Phone number must be at least 7 digits');

// URL validation schema - not empty
export const urlValidation = z
  .string()
  .min(1, 'URL is required');

// PDF validation schema - for file uploads
export const pdfValidation = z
  .string()
  .min(1, 'PDF file is required');

// vCard validation schema - for vCard generation
export const vCardValidation = z
  .string()
  .min(1, 'vCard is required');

// Combined validation schema for all URL types
export const textUrlValidation = z.object({
  url: z.string().min(1, 'This field is required'),
  urlType: z.enum(['url', 'email', 'phone', 'pdf', 'vcard']),
});

// Type for the validation result
export type TextUrlValidationResult = {
  isValid: boolean;
  error?: string;
};

// Helper function to validate based on URL type
export const validateTextUrl = (value: string, urlType: 'url' | 'email' | 'phone' | 'pdf' | 'vcard'): TextUrlValidationResult => {
  try {
    switch (urlType) {
      case 'email':
        emailValidation.parse(value);
        break;
      case 'phone':
        phoneValidation.parse(value);
        break;
      case 'pdf':
        pdfValidation.parse(value);
        break;
      case 'vcard':
        vCardValidation.parse(value);
        break;
      case 'url':
      default:
        urlValidation.parse(value);
        break;
    }
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};
