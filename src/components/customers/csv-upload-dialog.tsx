'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Download, FileText, Upload } from 'lucide-react';
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

type CSVCustomer = {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  brandColor?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
};

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
    const csvContent = [
      requiredFields.concat(optionalFields).join(','),
      'John Doe,john@example.com,+1234567890,https://johndoe.com,#3B82F6,https://linkedin.com/in/johndoe,@johndoe,@johndoe_insta',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
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

  const handleUpload = () => {
    onUpload(uploadedData);
    setStep('success');
    setTimeout(() => {
      onOpenChange(false);
      resetDialog();
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="size-5" />
            <span>Bulk Upload Customers</span>
          </DialogTitle>
          <DialogDescription>
            Upload customer profiles via CSV file. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Template Download */}
              <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="size-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">
                        Download CSV Template
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Use this template to format your customer data correctly
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="mr-2 size-4" />
                    Download Template
                  </Button>
                </div>
              </Card>

              {/* Required Fields Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="mb-2 font-medium text-green-700 dark:text-green-400">
                    Required Fields
                  </h4>
                  <div className="space-y-1">
                    {requiredFields.map(field => (
                      <Badge key={field} variant="secondary" className="mr-1">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="mb-2 font-medium text-blue-700 dark:text-blue-400">
                    Optional Fields
                  </h4>
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
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-slate-300 hover:border-blue-400 dark:border-slate-600',
                  isProcessing && 'pointer-events-none opacity-50',
                )}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Upload className="size-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {isDragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Drag and drop your CSV file here, or click to browse
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
                      <h4 className="mb-2 font-medium text-red-900 dark:text-red-100">
                        Validation Errors
                      </h4>
                      <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                        {errors.map(error => (
                          <li key={nanoid()}>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Preview (
                  {uploadedData.length}
                  {' '}
                  customers)
                </h3>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    Back
                  </Button>
                  <Button onClick={handleUpload}>
                    Upload
                    {' '}
                    {uploadedData.length}
                    {' '}
                    Customers
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Email</th>
                      <th className="p-3 text-left font-medium">Phone</th>
                      <th className="p-3 text-left font-medium">Website</th>
                      <th className="p-3 text-left font-medium">Brand Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.map(customer => (
                      <tr key={nanoid()} className="border-t">
                        <td className="p-3">{customer.name}</td>
                        <td className="p-3">{customer.email}</td>
                        <td className="p-3">{customer.phone}</td>
                        <td className="p-3">{customer.website || '-'}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <div
                              className="size-4 rounded"
                              style={{ backgroundColor: customer.brandColor }}
                            />
                            <span className="font-mono text-xs">{customer.brandColor}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Upload Successful!</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {uploadedData.length}
                {' '}
                customers have been uploaded successfully.
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
