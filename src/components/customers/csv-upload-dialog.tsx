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
import { cn } from '@/lib/utils';

type CSVUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (customers: CSVCustomer[]) => void;
};

const requiredFields = ['name', 'email'];
const optionalFields = ['phone', 'website', 'brandColor', 'linkedin', 'twitter', 'instagram'];

export function CSVUploadDialog({ open, onOpenChange, onUpload }: CSVUploadDialogProps) {
  const [uploadedData, setUploadedData] = useState<CSVCustomer[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');

  const validateCSVData = (data: any[]): { valid: CSVCustomer[]; errors: string[] } => {
    const validData: CSVCustomer[] = [];
    const validationErrors: string[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because index starts at 0 and we skip header

      // Check required fields
      for (const field of requiredFields) {
        if (!row[field] || row[field].trim() === '') {
          validationErrors.push(`Row ${rowNumber}: Missing required field '${field}'`);
          return;
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        validationErrors.push(`Row ${rowNumber}: Invalid email format`);
        return;
      }

      // Validate brand color format (if provided)
      if (row.brandColor && !row.brandColor.match(/^#[0-9A-F]{6}$/i)) {
        validationErrors.push(`Row ${rowNumber}: Invalid brand color format (should be #RRGGBB)`);
        return;
      }

      // Create customer object
      const customer: CSVCustomer = {
        name: row.name.trim(),
        email: row.email.trim(),
        phone: row.phone?.trim() || undefined,
        website: row.website?.trim() || undefined,
        brandColor: row.brandColor?.trim() || '#3B82F6',
        linkedin: row.linkedin?.trim() || undefined,
        twitter: row.twitter?.trim() || undefined,
        instagram: row.instagram?.trim() || undefined,
      };

      validData.push(customer);
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
      complete: (results) => {
        const { valid, errors: validationErrors } = validateCSVData(results.data);

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
        setErrors([`Failed to parse CSV: ${error.message}`]);
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
      'Innovate Inc.,contact@innovate.com,+15551234567,https://innovate.com,#4A90E2,https://linkedin.com/in/innovate,https://x.com/innovate,@innovate_global',
      'Quantum Solutions,qs@example.com,+15559876543,https://quantum.dev,#50E3C2,https://linkedin.com/in/quantum,,@quantum_sols',
      'Stellar Goods,hello@stellar.co,,https://stellar.co,#E24A90,https://linkedin.com/in/stellargoods,https://x.com/stellargoods,',
      'Apex Digital,support@apexdigital.net,+15552345678,https://apexdigital.net,#F5A623,,https://x.com/apexdigital,',
      'Synergy Labs,info@synergylabs.io,,https://synergylabs.io,#9013FE,https://linkedin.com/in/synergylabs,,',
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
  };

  const handleUpload = async () => {
    setIsProcessing(true);
    try {
      await onUpload(uploadedData);
      setStep('success');
    } catch {
      setErrors(['An unexpected error occurred during upload. Please try again.']);
      setStep('upload'); // Go back to upload step to show the error
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
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
          <div className="flex h-[80vh] flex-1 flex-col p-6">
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
                              {errors.map(error => (
                                <li key={nanoid()}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {step === 'preview' && (
                  <div className="flex h-full flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        Preview (
                        {uploadedData.length}
                        {' '}
                        customers)
                      </h3>
                    </div>

                    <div className="grow overflow-hidden rounded-lg border">
                      <div className="h-full overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                            <tr>
                              <th className="p-3 text-left font-medium">
                                Name
                              </th>
                              <th className="p-3 text-left font-medium">
                                Email
                              </th>
                              <th className="p-3 text-left font-medium">
                                Website
                              </th>
                              <th className="p-3 text-left font-medium">
                                Brand Color
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {uploadedData.map(customer => (
                              <tr
                                key={nanoid()}
                                className="border-t dark:border-slate-700"
                              >
                                <td className="p-3">{customer.name}</td>
                                <td className="p-3">{customer.email}</td>
                                <td className="p-3">
                                  {customer.website || '-'}
                                </td>
                                <td className="p-3">
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
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
  );
}
