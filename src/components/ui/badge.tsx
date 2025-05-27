import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        'default':
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        'secondary':
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'success':
          'border-transparent bg-success text-white shadow-sm',
        'warning':
          'border-transparent bg-warning text-white shadow-sm',
        'error':
          'border-transparent bg-error text-white shadow-sm',
        'info':
          'border-transparent bg-info text-white shadow-sm',
        'outline': 'border-border text-foreground',
        'success-outline':
          'border-success/20 bg-success/10 text-success',
        'warning-outline':
          'border-warning/20 bg-warning/10 text-warning',
        'error-outline':
          'border-error/20 bg-error/10 text-error',
        'info-outline':
          'border-info/20 bg-info/10 text-info',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type BadgeProps = {
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

const Badge = (
  { ref, className, variant, size, icon, removable = false, onRemove, children, ...props }: BadgeProps & { ref?: React.RefObject<HTMLDivElement | null> },
) => {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    >
      {icon && (
        <span className="mr-1 flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {removable && onRemove && (
        <button
          type="button"
          className="ml-1 flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-white/50"
          onClick={onRemove}
          aria-label="Remove"
        >
          <svg
            className="size-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
