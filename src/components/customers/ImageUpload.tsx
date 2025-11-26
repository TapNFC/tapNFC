'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type ImageUploadProps = {
  value?: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
};

export const ImageUpload = ({
  value,
  onChange,
  disabled,
}: ImageUploadProps) => {
  const [base64, setBase64] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (newBase64: string) => {
    onChange(newBase64);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        // This can happen if the user cancels the file selection dialog.
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Invalid file type. Please upload an image.');
        toast.error('Upload Error', {
          description: 'Please select a valid image file (e.g., PNG, JPG, GIF).',
        });
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit.');
        toast.error('Upload Error', {
          description: 'The selected image is too large. Please choose a file under 5MB.',
        });
        return;
      }

      setIsUploading(true);
      setUploadError(null);
      const reader = new FileReader();

      reader.onload = (event: any) => {
        setBase64(event.target.result);
        handleChange(event.target.result);
        setIsUploading(false);
      };

      reader.onerror = () => {
        setUploadError('Failed to read the file.');
        toast.error('Upload Error', {
          description: 'There was an issue processing your image. Please try again.',
        });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    },
    [handleChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop,
    disabled,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/svg+xml': [],
      'image/webp': [],
    },
  });

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering the dropzone
    setBase64(undefined);
    onChange('');
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500 dark:hover:bg-slate-700/50',
        isDragActive && 'border-emerald-600 bg-emerald-100 dark:bg-emerald-900/50',
        disabled && 'cursor-not-allowed opacity-60',
        uploadError && 'border-red-500 bg-red-50',
      )}
    >
      <input {...getInputProps()} />

      <AnimatePresence>
        {base64
          ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-10"
              >
                <img
                  src={base64}
                  alt="Uploaded Preview"
                  className="size-full rounded-md object-cover"
                />
                {!disabled && (
                  <Button
                    type="button"
                    variant="danger"
                    size="icon"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 z-20 size-7 rounded-full"
                    aria-label="Remove image"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </motion.div>
            )
          : isUploading
            ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  <Loader2 className="size-8 animate-spin text-emerald-500" />
                  <p className="text-sm font-medium">Uploading...</p>
                </motion.div>
              )
            : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-2 text-center"
                >
                  {isDragActive
                    ? (
                        <>
                          <UploadCloud className="size-10 text-emerald-500" />
                          <p className="font-semibold">Drop image here</p>
                        </>
                      )
                    : (
                        <>
                          <ImageIcon className="size-10" />
                          <p className="font-semibold">Click to upload or drag & drop</p>
                          <p className="text-xs">SVG, PNG, JPG or GIF (max. 5MB)</p>
                        </>
                      )}
                </motion.div>
              )}
      </AnimatePresence>

      {uploadError && !isUploading && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-600">
          {uploadError}
        </div>
      )}
    </div>
  );
};
