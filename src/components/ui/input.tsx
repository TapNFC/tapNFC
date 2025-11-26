import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border bg-background px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input hover:border-neutral-300 focus-visible:border-primary',
        error: 'border-error focus-visible:border-error focus-visible:ring-error/20',
        success: 'border-success focus-visible:border-success focus-visible:ring-success/20',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3',
        lg: 'h-10 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type InputProps = {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>;

const Input = ({ ref, className, containerClassName, variant, size, type, label, helper, error, leftIcon, rightIcon, id, ...props }: InputProps & { ref?: unknown | React.RefObject<HTMLInputElement | null> }) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  // Determine variant based on error state
  const inputVariant = error ? 'error' : variant;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            inputVariants({ variant: inputVariant, size }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className,
          )}
          ref={ref as React.RefObject<HTMLInputElement>}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>

      {(helper || error) && (
        <div className="space-y-1">
          {error && (
            <p
              id={errorId}
              className="flex items-center gap-1 text-xs text-error"
              role="alert"
              aria-live="polite"
            >
              <svg
                className="size-3 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {error}
            </p>
          )}
          {helper && !error && (
            <p
              id={helperId}
              className="text-xs text-muted-foreground"
            >
              {helper}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

Input.displayName = 'Input';

export { Input, inputVariants };
