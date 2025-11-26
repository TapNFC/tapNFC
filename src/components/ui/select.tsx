import type { VariantProps } from 'class-variance-authority';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const selectTriggerVariants = cva(
  'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  {
    variants: {
      variant: {
        default: 'border-input hover:border-neutral-300',
        error: 'border-error focus:border-error focus:ring-error/20',
        success: 'border-success focus:border-success focus:ring-success/20',
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

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

type SelectTriggerProps = {} & React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & VariantProps<typeof selectTriggerVariants>;

const SelectTrigger = ({ ref, className, variant, size, children, ...props }: SelectTriggerProps & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Trigger> | null> }) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.ScrollUpButton> | null> }) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.ScrollDownButton> | null> }) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
);
SelectScrollDownButton.displayName
  = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = ({ ref, className, children, position = 'popper', ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Content> | null> }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper'
        && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper'
          && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Label> | null> }) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = ({ ref, className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Item> | null> }) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Separator> | null> }) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Enhanced Select Field Component
export type SelectFieldProps = {
  label?: string;
  helper?: string;
  error?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
  containerClassName?: string;
};

const SelectField = (
  { ref, label, helper, error, placeholder = 'Select an option', options, value, onValueChange, variant = 'default', size = 'md', disabled = false, required = false, containerClassName }: SelectFieldProps & { ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Trigger> | null> },
) => {
  const selectId = React.useId();
  const helperId = helper ? `${selectId}-helper` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  // Determine variant based on error state
  const selectVariant = error ? 'error' : variant;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          ref={ref}
          variant={selectVariant}
          size={size}
          id={selectId}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}
          {helper && !error && (
            <p id={helperId} className="text-xs text-muted-foreground">
              {helper}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

SelectField.displayName = 'SelectField';

export {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
