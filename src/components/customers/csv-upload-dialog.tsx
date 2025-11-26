'use client';

import type { CSVCustomer } from '@/types/customer';
import { AnimatePresence, motion } from 'framer-motion';

import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Loader2,
  Upload,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import Papa from 'papaparse';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCustomersWithQuery } from '@/hooks/useCustomersWithQuery';
import { cn } from '@/lib/utils';

type CSVUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (customers: CSVCustomer[]) => void;
};

const requiredFields = ['name', 'email'];
const optionalFields = ['phone', 'website', 'brandColor', 'linkedin', 'twitter', 'instagram'];

// LinkedIn URL validation - must be a valid LinkedIn URL
const linkedinUrlSchema = z.string().refine(
  (url) => {
    if (!url) {
      return true; // Optional field
    }
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('linkedin.com');
    } catch {
      return false;
    }
  },
  'Must be a valid LinkedIn URL',
).optional().or(z.literal(''));

// Twitter URL validation - must be a valid Twitter/X URL
const twitterUrlSchema = z.string().refine(
  (url) => {
    if (!url) {
      return true; // Optional field
    }
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com');
    } catch {
      return false;
    }
  },
  'Must be a valid Twitter/X URL',
).optional().or(z.literal(''));

// Enhanced CSV validation schema
const enhancedCsvCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9+\-\s()]*$/, 'Phone number cannot contain letters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  brandColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format (use #RRGGBB)').optional(),
  linkedin: linkedinUrlSchema,
  twitter: twitterUrlSchema,
  instagram: z.string().optional(),
});

type ValidationError = {
  type: 'missing_column' | 'row_validation' | 'parsing';
  message: string;
  row?: number;
  column?: string;
};

export function CSVUploadDialog({ open, onOpenChange, onUpload }: CSVUploadDialogProps) {
  const { customers: existingCustomers } = useCustomersWithQuery();
  const [uploadedData, setUploadedData] = useState<CSVCustomer[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'duplicate_check' | 'success'>('upload');
  const [duplicateCustomers, setDuplicateCustomers] = useState<Array<{ csvData: CSVCustomer; existingCustomer: any; rowNumber: number }>>([]);

  const validateCSVData = (data: any[], headers: string[]): { valid: CSVCustomer[]; errors: ValidationError[] } => {
    const validData: CSVCustomer[] = [];
    const validationErrors: ValidationError[] = [];
    const emailSet = new Set<string>();

    // Step 1: Check required columns first
    const missingRequiredColumns = requiredFields.filter(field => !headers.includes(field));

    if (missingRequiredColumns.length > 0) {
      missingRequiredColumns.forEach((column) => {
        validationErrors.push({
          type: 'missing_column',
          message: `Missing required column: ${column}`,
          column,
        });
      });
      return { valid: [], errors: validationErrors };
    }

    // Step 2: Row-level validation (only if required columns exist)
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because index starts at 0 and we skip header

      let rowHasErrors = false;
      const rowErrors: ValidationError[] = [];

      // Check for missing required fields first
      if (!row.name || row.name.trim() === '') {
        rowErrors.push({
          type: 'row_validation',
          message: `Row ${rowNumber}: Name is missing`,
          row: rowNumber,
          column: 'name',
        });
        rowHasErrors = true;
      }

      if (!row.email || row.email.trim() === '') {
        rowErrors.push({
          type: 'row_validation',
          message: `Row ${rowNumber}: Email is missing`,
          row: rowNumber,
          column: 'email',
        });
        rowHasErrors = true;
      }

      // Check for duplicate emails (only if email exists)
      if (row.email && row.email.trim()) {
        const email = row.email.trim().toLowerCase();
        if (emailSet.has(email)) {
          rowErrors.push({
            type: 'row_validation',
            message: `Row ${rowNumber}: Duplicate email address "${row.email.trim()}"`,
            row: rowNumber,
            column: 'email',
          });
          rowHasErrors = true;
        } else {
          emailSet.add(email);
        }
      }

      // Always validate the row data using Zod schema to catch ALL field errors
      try {
        const validatedData = enhancedCsvCustomerSchema.parse(row);

        // Only create customer object if no critical errors (missing name/email)
        if (!rowHasErrors) {
          // Create customer object with validated data
          const customer: CSVCustomer = {
            name: validatedData.name.trim(),
            email: validatedData.email.trim(),
            phone: validatedData.phone?.trim() || undefined,
            website: validatedData.website?.trim() || undefined,
            brandColor: validatedData.brandColor?.trim() || '#3B82F6',
            linkedin: validatedData.linkedin?.trim() || undefined,
            twitter: validatedData.twitter?.trim() || undefined,
            instagram: validatedData.instagram?.trim() || undefined,
          };

          validData.push(customer);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Handle Zod validation errors
          error.errors.forEach((zodError) => {
            const field = zodError.path[0] as string;
            let message = '';

            if (field === 'email' && zodError.message.includes('Invalid email')) {
              message = `Row ${rowNumber}: Email is invalid`;
            } else if (field === 'name') {
              message = `Row ${rowNumber}: Name is invalid`;
            } else {
              message = `Row ${rowNumber}: ${zodError.message}`;
            }

            rowErrors.push({
              type: 'row_validation',
              message,
              row: rowNumber,
              column: field,
            });
          });
          rowHasErrors = true;
        } else {
          // Handle other validation errors
          rowErrors.push({
            type: 'row_validation',
            message: `Row ${rowNumber}: Validation failed`,
            row: rowNumber,
          });
          rowHasErrors = true;
        }
      }

      // Add all row errors to validation errors
      validationErrors.push(...rowErrors);
    });

    return { valid: validData, errors: validationErrors };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    setIsProcessing(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transform: value => value?.trim?.() || '',
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          // Handle CSV parsing errors
          const parsingErrors: ValidationError[] = results.errors.map((error) => {
            let message = error.message;

            // Provide more helpful error messages
            if (error.message.includes('Too many fields')) {
              message = `Row ${error.row}: Too many columns detected. Please ensure all rows have the same number of columns as the header row.`;
            } else if (error.message.includes('Too few fields')) {
              message = `Row ${error.row}: Too few columns detected. Please ensure all rows have the same number of columns as the header row.`;
            } else if (error.message.includes('Quoted field')) {
              message = `Row ${error.row}: Issue with quoted field. Please check for unescaped quotes in your data.`;
            }

            return {
              type: 'parsing',
              message: `CSV parsing error: ${message}`,
              row: error.row,
            };
          });
          setErrors(parsingErrors);
          setIsProcessing(false);
          return;
        }

        const headers = Object.keys(results.data[0] || {});
        const { valid, errors: validationErrors } = validateCSVData(results.data, headers);

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          setIsProcessing(false);
          return;
        }

        setUploadedData(valid);
        setStep('preview');
        setIsProcessing(false);
      },
      error: (error) => {
        setErrors([{
          type: 'parsing',
          message: `Failed to parse CSV: ${error.message}`,
        }]);
        setIsProcessing(false);
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
  });

  const downloadTemplate = () => {
    const headers = requiredFields.concat(optionalFields).join(',');
    const sampleData = [
      'Innovate Inc.,contact@innovate.com,+15551234567,https://innovate.com,#4A90E2,https://linkedin.com/in/innovate,https://x.com/innovate,innovate_inc',
      'Quantum Solutions,qs@example.com,+15559876543,https://quantum.dev,#50E3C2,https://linkedin.com/in/quantum,,quantum_solutions',
      'Stellar Goods,hello@stellar.co,,https://stellar.co,#E24A90,https://linkedin.com/in/stellargoods,https://x.com/stellargoods,stellar_goods',
      'Apex Digital,support@apexdigital.net,+15552345678,https://apexdigital.net,#F5A623,,https://x.com/apexdigital,apex_digital',
      'Synergy Labs,info@synergylabs.io,,https://synergylabs.io,#9013FE,https://linkedin.com/in/synergylabs,,synergy_labs',
    ];
    const csvContent = [headers, ...sampleData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setStep('upload');
    setUploadedData([]);
    setErrors([]);
    setIsProcessing(false);
    setDuplicateCustomers([]);
  };

  const checkExistingCustomers = async (customers: CSVCustomer[]): Promise<Array<{ csvData: CSVCustomer; existingCustomer: any; rowNumber: number }>> => {
    const duplicates: Array<{ csvData: CSVCustomer; existingCustomer: any; rowNumber: number }> = [];

    try {
      // Use existing customers from the hook to check for duplicates
      customers.forEach((customer, index) => {
        const existing = existingCustomers.find(ex => ex.email.toLowerCase() === customer.email.toLowerCase());
        if (existing) {
          duplicates.push({
            csvData: customer,
            existingCustomer: existing,
            rowNumber: index + 1,
          });
        }
      });

      return duplicates;
    } catch (error) {
      console.error('Error checking existing customers:', error);
      return [];
    }
  };

  const handleUpload = async () => {
    setIsProcessing(true);
    try {
      // Always check for existing customers in database first
      const existingDuplicates = await checkExistingCustomers(uploadedData);

      if (existingDuplicates.length > 0) {
        setDuplicateCustomers(existingDuplicates);
        setStep('duplicate_check');
        setIsProcessing(false);
        return;
      }

      // No duplicates found, but still go to duplicate check step to confirm
      // This ensures the user sees the conflict resolution UI even when no conflicts exist
      setStep('duplicate_check');
      setIsProcessing(false);
    } catch {
      setErrors([{
        type: 'parsing',
        message: 'An unexpected error occurred during duplicate check. Please try again.',
      }]);
      setStep('preview'); // Go back to preview step to show the error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (isProcessing) {
      return;
    }
    onOpenChange(isOpen);
    if (!isOpen) {
      // Delay reset to allow for closing animation
      setTimeout(resetDialog, 300);
    }
  };

  return (
    <>
      <style jsx>
        {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #475569;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
          
          .custom-scrollbar {
            scrollbar-color: #475569 transparent;
          }
        }
      `}
      </style>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[95vh] max-w-6xl overflow-hidden p-0">
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-1/3 flex-col space-y-4 border-r bg-slate-50 p-6 dark:bg-slate-800/50 md:flex">
              <DialogHeader className="text-left">
                <DialogTitle className="flex items-center space-x-2">
                  <Upload className="size-5" />
                  <span>Bulk Upload Customers</span>
                </DialogTitle>
                <DialogDescription>
                  Follow the steps to upload customer profiles via CSV file.
                </DialogDescription>
              </DialogHeader>

              {/* Stepper */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full',
                      step === 'upload'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Upload File</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select your CSV file
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full',
                      step === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Preview Data</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Review and confirm
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full',
                      step === 'duplicate_check'
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    3
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Resolve Conflicts</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Handle duplicates
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full',
                      step === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                    )}
                  >
                    <CheckCircle className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Success</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Upload completed
                    </p>
                  </div>
                </div>
              </div>
              <div className="grow" />
              <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <div className="flex items-start space-x-3">
                  <FileText className="size-5 shrink-0 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100">
                      CSV Template
                    </h3>
                    <p className="mb-3 text-sm text-blue-700 dark:text-blue-300">
                      Use our template to ensure your data is formatted correctly.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white dark:bg-blue-950"
                      onClick={downloadTemplate}
                    >
                      <Download className="mr-2 size-4" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            {/* Main Content */}
            <div className="flex h-[85vh] flex-1 flex-col p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full flex-col"
                >
                  {step === 'upload' && (
                    <div className="flex h-full flex-col justify-center space-y-6">
                      {/* Required Fields Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h3 className="mb-2 text-base font-semibold text-green-700 dark:text-green-400">
                            Required Fields
                          </h3>
                          <div className="space-y-1">
                            {requiredFields.map(field => (
                              <Badge key={field} variant="secondary" className="mr-1">
                                {field}
                              </Badge>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                            These columns must be present in your CSV
                          </p>
                        </Card>
                        <Card className="p-4">
                          <h3 className="mb-2 text-base font-semibold text-blue-700 dark:text-blue-400">
                            Optional Fields
                          </h3>
                          <div className="space-y-1">
                            {optionalFields.map(field => (
                              <Badge key={field} variant="outline" className="mr-1">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      </div>

                      {/* Upload Area */}
                      <div
                        {...getRootProps()}
                        className={cn(
                          'flex flex-grow cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                          isDragActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-slate-300 hover:border-blue-400 dark:border-slate-600',
                          isProcessing && 'pointer-events-none opacity-50',
                        )}
                      >
                        <input {...getInputProps()} />
                        <div className="space-y-4">
                          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700/50">
                            <Upload className="size-8 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">
                              {isDragActive
                                ? 'Drop your CSV file here'
                                : 'Upload CSV File'}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Drag and drop or click to browse
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                              Supports: .csv files only
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Errors */}
                      {errors.length > 0 && (
                        <Card className="border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="mt-0.5 size-5 text-red-600" />
                            <div className="flex-1">
                              <h3 className="mb-2 text-base font-semibold text-red-900 dark:text-red-100">
                                Validation Errors
                              </h3>
                              <ul className="max-h-24 space-y-1 overflow-y-auto text-sm text-red-700 dark:text-red-300">
                                {errors.map((error, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                      {error.type === 'missing_column' && '📋'}
                                      {error.type === 'row_validation' && '⚠️'}
                                      {error.type === 'parsing' && '❌'}
                                    </span>
                                    <span>{error.message}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  )}

                  {step === 'preview' && (
                    <div className="flex h-full flex-col">
                      {/* Header Section */}
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Preview (
                          {uploadedData.length}
                          {' '}
                          customers)
                        </h3>
                      </div>

                      {/* Table Section - Scrollable */}
                      <div className="mb-4 min-h-0 flex-1">
                        <div className="h-full overflow-hidden rounded-lg border">
                          <div className="custom-scrollbar h-full max-w-3xl overflow-auto">
                            <table className="w-full min-w-max text-sm">
                              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                                <tr>
                                  <th className="whitespace-nowrap p-3 text-left font-medium text-slate-600 dark:text-slate-400">
                                    #
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    Name
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    Email
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    Phone
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    Website
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    Brand Color
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    LinkedIn
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    Twitter
                                  </th>
                                  <th className="whitespace-nowrap p-3 text-left font-medium">
                                    Instagram
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {uploadedData.map((customer, index) => (
                                  <tr
                                    key={nanoid()}
                                    className="border-t dark:border-slate-700"
                                  >
                                    <td className="whitespace-nowrap p-3 text-center font-mono text-sm text-slate-500 dark:text-slate-400">
                                      {index + 1}
                                    </td>
                                    <td className="whitespace-nowrap p-3">{customer.name}</td>
                                    <td className="whitespace-nowrap p-3">{customer.email}</td>
                                    <td className="whitespace-nowrap p-3">
                                      {customer.phone || '-'}
                                    </td>
                                    <td className="whitespace-nowrap p-3">
                                      {customer.website || '-'}
                                    </td>
                                    <td className="whitespace-nowrap p-3">
                                      <div className="flex items-center space-x-2">
                                        <div
                                          className="size-4 rounded border dark:border-slate-600"
                                          style={{
                                            backgroundColor: customer.brandColor,
                                          }}
                                        />
                                        <span className="font-mono text-xs">
                                          {customer.brandColor}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap p-3">
                                      {customer.linkedin || '-'}
                                    </td>
                                    <td className="whitespace-nowrap p-3">
                                      {customer.twitter || '-'}
                                    </td>
                                    <td className="whitespace-nowrap p-3">
                                      {customer.instagram || '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Buttons Section - Fixed at bottom */}
                      <div className="flex justify-end space-x-2 border-t pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setStep('upload')}
                          disabled={isProcessing}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleUpload}
                          disabled={isProcessing}
                          className="w-48"
                        >
                          {isProcessing
                            ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                              )
                            : null}
                          {isProcessing
                            ? 'Uploading...'
                            : `Import ${uploadedData.length} Customers`}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 'duplicate_check' && (
                    <div className="flex h-full flex-col">
                      {/* Header */}
                      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {duplicateCustomers.length > 0
                              ? (
                                  'Resolve Duplicate Conflicts'
                                )
                              : (
                                  'Ready to Import'
                                )}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {duplicateCustomers.length > 0
                              ? (
                                  <>
                                    {duplicateCustomers.length}
                                    {' '}
                                    customer
                                    {duplicateCustomers.length !== 1 ? 's' : ''}
                                    {' '}
                                    already exist in your database
                                  </>
                                )
                              : (
                                  'No conflicts found. Your data is ready to import.'
                                )}
                          </p>
                        </div>
                        <Badge
                          variant={duplicateCustomers.length > 0 ? 'secondary' : 'default'}
                          className={
                            duplicateCustomers.length > 0
                              ? 'bg-orange-100 text-sm text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
                              : 'bg-green-100 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200'
                          }
                        >
                          {duplicateCustomers.length > 0
                            ? `${duplicateCustomers.length} Conflicts`
                            : 'No Conflicts'}
                        </Badge>
                      </div>

                      {/* Duplicate Customers Table or Success Message */}
                      <div className="mb-4 min-h-0 flex-1">
                        {duplicateCustomers.length > 0
                          ? (
                              <div className="h-full overflow-hidden rounded-lg border">
                                <div className="custom-scrollbar size-full overflow-auto">
                                  <table className="w-full min-w-max text-sm">
                                    <thead className="sticky top-0 border-b border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20">
                                      <tr>
                                        <th className="whitespace-nowrap p-3 text-left font-medium text-orange-800 dark:text-orange-200">
                                          #
                                        </th>
                                        <th className="whitespace-nowrap p-3 text-left font-medium text-orange-800 dark:text-orange-200">
                                          CSV Data
                                        </th>
                                        <th className="whitespace-nowrap p-3 text-left font-medium text-orange-800 dark:text-orange-200">
                                          Existing Customer
                                        </th>
                                        <th className="whitespace-nowrap p-3 text-left font-medium text-orange-800 dark:text-orange-200">
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-orange-200 dark:divide-orange-700">
                                      {duplicateCustomers.map((duplicate, index) => (
                                        <tr key={index} className="hover:bg-orange-50 dark:hover:bg-orange-900/10">
                                          <td className="whitespace-nowrap p-3 text-center font-mono text-sm text-orange-600 dark:text-orange-400">
                                            {duplicate.rowNumber}
                                          </td>
                                          <td className="whitespace-nowrap p-3">
                                            <div className="space-y-1">
                                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                                {duplicate.csvData.name}
                                              </div>
                                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                                {duplicate.csvData.email}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="whitespace-nowrap p-3">
                                            <div className="space-y-1">
                                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                                {duplicate.existingCustomer.name}
                                              </div>
                                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                                {duplicate.existingCustomer.email}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="whitespace-nowrap p-3">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                                              onClick={() => {
                                                // Remove from duplicates and remove from upload data
                                                setDuplicateCustomers(prev => prev.filter((_, i) => i !== index));
                                                setUploadedData(prev => prev.filter(customer => customer.email !== duplicate.csvData.email));
                                              }}
                                            >
                                              Remove from Import
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )
                          : uploadedData.length === 0
                            ? (
                                <div className="flex h-full items-center justify-center">
                                  <div className="text-center">
                                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                      <AlertCircle className="size-8 text-yellow-600" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-yellow-700 dark:text-yellow-400">
                                      No Customers to Import
                                    </h3>
                                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                                      All customers were duplicates and have been removed from the import list.
                                    </p>
                                    <Button
                                      onClick={() => setStep('upload')}
                                      className="bg-yellow-600 text-white hover:bg-yellow-700"
                                    >
                                      Upload New File
                                    </Button>
                                  </div>
                                </div>
                              )
                            : (
                                <div className="flex h-full items-center justify-center">
                                  <div className="text-center">
                                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                      <CheckCircle className="size-8 text-green-600" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-green-700 dark:text-green-400">
                                      No Conflicts Found!
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      All
                                      {' '}
                                      {uploadedData.length}
                                      {' '}
                                      customers are ready to import.
                                    </p>
                                  </div>
                                </div>
                              )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {duplicateCustomers.length === 0
                            ? uploadedData.length === 0
                              ? 'No customers to import'
                              : 'All conflicts resolved'
                            : `${duplicateCustomers.length} conflict${duplicateCustomers.length !== 1 ? 's' : ''} remaining`}
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => setStep('preview')}
                            disabled={isProcessing}
                          >
                            Back to Preview
                          </Button>
                          {uploadedData.length > 0 && (
                            <Button
                              onClick={async () => {
                                if (duplicateCustomers.length === 0) {
                                // All conflicts resolved, proceed with upload
                                  try {
                                    setIsProcessing(true);
                                    await onUpload(uploadedData);
                                    setStep('success');
                                  } catch {
                                    setErrors([{
                                      type: 'parsing',
                                      message: 'An unexpected error occurred during upload. Please try again.',
                                    }]);
                                    setStep('preview');
                                  } finally {
                                    setIsProcessing(false);
                                  }
                                }
                              }}
                              disabled={isProcessing || duplicateCustomers.length > 0}
                              className="bg-orange-600 text-white hover:bg-orange-700"
                            >
                              {isProcessing
                                ? (
                                    <>
                                      <Loader2 className="mr-2 size-4 animate-spin" />
                                      Uploading...
                                    </>
                                  )
                                : (
                                    <>
                                      <Upload className="mr-2 size-4" />
                                      Import
                                      {' '}
                                      {uploadedData.length}
                                      {' '}
                                      Customer
                                      {uploadedData.length !== 1 ? 's' : ''}
                                    </>
                                  )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 'success' && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.1,
                          type: 'spring',
                          stiffness: 400,
                          damping: 20,
                        }}
                        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                      >
                        <CheckCircle className="size-8 text-green-600" />
                      </motion.div>
                      <h3 className="mb-2 text-xl font-semibold">
                        Upload Successful!
                      </h3>
                      <p className="mb-6 text-slate-600 dark:text-slate-400">
                        {uploadedData.length}
                        {' '}
                        customers have been added to your
                        list.
                      </p>
                      <Button
                        onClick={() => handleClose(false)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
