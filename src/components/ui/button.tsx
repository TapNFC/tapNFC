import type { VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-primary-blue-dark hover:shadow-medium active:translate-y-0 active:shadow-soft',
        secondary:
          'bg-secondary text-secondary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-medium active:translate-y-0 active:shadow-soft',
        danger:
          'bg-error text-white shadow-soft hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-medium active:translate-y-0 active:shadow-soft',
        ghost:
          'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200',
        outline:
          'border border-input bg-background text-foreground shadow-soft hover:bg-accent hover:text-accent-foreground hover:shadow-medium',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: 'size-9 rounded-lg bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 py-2',
        lg: 'h-10 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const Button = (
  { ref, className, variant, size, asChild = false, loading = false, leftIcon, rightIcon, children, disabled, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> },
) => {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || loading;

  if (asChild) {
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="-ml-1 mr-2 size-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && (
        <span className="flex items-center" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="flex items-center" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </Comp>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };
