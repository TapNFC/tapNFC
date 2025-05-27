'use client';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sidebarVariants = cva(
  'flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out',
  {
    variants: {
      collapsed: {
        true: 'w-16',
        false: 'w-64',
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  },
);

export type SidebarProps = {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarVariants>;

export type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export const useSidebar = () => {
  const context = React.use(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar');
  }
  return context;
};

const Sidebar = (
  { ref, className, collapsible = true, defaultCollapsed = false, onCollapsedChange, children, ...props }: SidebarProps & { ref?: React.RefObject<HTMLDivElement | null> },
) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  const handleCollapsedChange = React.useCallback(
    (newCollapsed: boolean) => {
      setCollapsed(newCollapsed);
      onCollapsedChange?.(newCollapsed);
    },
    [onCollapsedChange],
  );

  const contextValue = React.useMemo(
    () => ({
      collapsed,
      setCollapsed: handleCollapsedChange,
    }),
    [collapsed, handleCollapsedChange],
  );

  return (
    <SidebarContext value={contextValue}>
      <div
        ref={ref}
        className={cn(sidebarVariants({ collapsed }), className)}
        {...props}
      >
        {children}
        {collapsible && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-6 z-10 size-6 rounded-full border bg-background shadow-md hover:shadow-lg"
            onClick={() => handleCollapsedChange(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? (
                  <ChevronRight className="size-3" />
                )
              : (
                  <ChevronLeft className="size-3" />
                )}
          </Button>
        )}
      </div>
    </SidebarContext>
  );
};

Sidebar.displayName = 'Sidebar';

// Sidebar Header
export type SidebarHeaderProps = {} & React.HTMLAttributes<HTMLDivElement>;

const SidebarHeader = ({ ref, className, children, ...props }: SidebarHeaderProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { collapsed } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        'flex h-16 items-center border-b px-4',
        collapsed && 'justify-center px-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

SidebarHeader.displayName = 'SidebarHeader';

// Sidebar Content
export type SidebarContentProps = {} & React.HTMLAttributes<HTMLDivElement>;

const SidebarContent = ({ ref, className, children, ...props }: SidebarContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div
      ref={ref}
      className={cn('flex-1 overflow-y-auto py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

SidebarContent.displayName = 'SidebarContent';

// Sidebar Footer
export type SidebarFooterProps = {} & React.HTMLAttributes<HTMLDivElement>;

const SidebarFooter = ({ ref, className, children, ...props }: SidebarFooterProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div
      ref={ref}
      className={cn('border-t p-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

SidebarFooter.displayName = 'SidebarFooter';

// Navigation Item
export type NavItemProps = {
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLElement>;

const NavItem = (
  { ref, className, href, icon, badge, active, disabled = false, children, ...props }: NavItemProps & { ref?: React.RefObject<HTMLAnchorElement | null> },
) => {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const isActive = active ?? pathname === href;

  const content = (
    <>
      {icon && (
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center',
            collapsed ? 'mx-auto' : 'mr-3',
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {!collapsed && (
        <span className="flex-1 truncate">{children}</span>
      )}
      {!collapsed && badge && (
        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {badge}
        </span>
      )}
    </>
  );

  if (disabled) {
    return (
      <div
        className={cn(
          'flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-not-allowed opacity-50',
          collapsed && 'justify-center px-2',
          className,
        )}
        {...props}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground',
        collapsed && 'justify-center px-2',
        className,
      )}
      title={collapsed ? children?.toString() : undefined}
      {...props}
    >
      {content}
    </Link>
  );
};

NavItem.displayName = 'NavItem';

// Navigation Group
export type NavGroupProps = {
  label?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const NavGroup = ({ ref, className, label, children, ...props }: NavGroupProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { collapsed } = useSidebar();

  return (
    <div ref={ref} className={cn('px-3 py-2', className)} {...props}>
      {!collapsed && label && (
        <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </h4>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

NavGroup.displayName = 'NavGroup';

// Logo Component
export type LogoProps = {
  src?: string;
  alt?: string;
  href?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Logo = ({ ref, className, src, alt = 'Logo', href = '/', children, ...props }: LogoProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { collapsed } = useSidebar();

  const logoContent = (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        collapsed ? 'justify-center' : 'space-x-2',
        className,
      )}
      {...props}
    >
      {src
        ? (
            <img
              src={src}
              alt={alt}
              className={cn(
                'h-8 w-8 object-contain',
                collapsed ? 'h-6 w-6' : 'h-8 w-8',
              )}
            />
          )
        : (
            <div
              className={cn(
                'flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold',
                collapsed ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm',
              )}
            >
              {children || 'L'}
            </div>
          )}
      {!collapsed && (
        <span className="text-lg font-bold text-foreground">
          {children || 'Logo'}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

Logo.displayName = 'Logo';

export {
  Logo,
  NavGroup,
  NavItem,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
};
