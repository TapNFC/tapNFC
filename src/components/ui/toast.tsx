/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable ts/no-redeclare */
import type { VariantProps } from 'class-variance-authority';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

type ToastViewportProps
  = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
    & { ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Viewport> | null> };

const ToastViewport = ({ ref, className, ...props }: ToastViewportProps) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success:
          'success text-success-foreground group border-success/20 bg-success/10',
        error:
          'destructive text-error-foreground group border-error/20 bg-error/10',
        warning:
          'warning text-warning-foreground group border-warning/20 bg-warning/10',
        info: 'info text-info-foreground group border-info/20 bg-info/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type ToastPropsInternal
  = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
    & VariantProps<typeof toastVariants>
    & { ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Root> | null> };

const Toast = ({ ref, className, variant, ...props }: ToastPropsInternal) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
};
Toast.displayName = ToastPrimitives.Root.displayName;

type ToastActionProps
  = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
    & { ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Action> | null> };

const ToastAction = ({ ref, className, ...props }: ToastActionProps) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

type ToastCloseProps
  = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
    & { ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Close> | null> };

const ToastClose = ({ ref, className, ...props }: ToastCloseProps) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="size-4" />
  </ToastPrimitives.Close>
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

type ToastTitleProps
  = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
    & { ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Title> | null> };

const ToastTitle = ({ ref, className, ...props }: ToastTitleProps) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

type ToastDescriptionProps
  = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
    & { ref?: React.RefObject<React.ElementRef<typeof ToastPrimitives.Description> | null> };

const ToastDescription = ({ ref, className, ...props }: ToastDescriptionProps) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

// Enhanced Toast Hook
type ToastOptions = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastOptions & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action
  = | {
    type: ActionType['ADD_TOAST'];
    toast: ToasterToast;
  }
  | {
    type: ActionType['UPDATE_TOAST'];
    toast: Partial<ToasterToast>;
  }
  | {
    type: ActionType['DISMISS_TOAST'];
    toastId?: ToasterToast['id'];
  }
  | {
    type: ActionType['REMOVE_TOAST'];
    toastId?: ToasterToast['id'];
  };

type State = {
  toasts: ToasterToast[];
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

// Convenience methods
toast.success = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: 'success',
    title: message,
    ...options,
  });
};

toast.error = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: 'error',
    title: message,
    ...options,
  });
};

toast.warning = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: 'warning',
    title: message,
    ...options,
  });
};

toast.info = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
  return toast({
    variant: 'info',
    title: message,
    ...options,
  });
};

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

// Toaster Component
function Toaster() {
  const { toasts } = useToast();

  const getIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="size-5 text-success" />;
      case 'error':
        return <AlertCircle className="size-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="size-5 text-warning" />;
      case 'info':
        return <Info className="size-5 text-info" />;
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start space-x-3">
              {getIcon(variant)}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

export {
  Toast,
  toast,
  ToastAction,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  Toaster,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast,
};
