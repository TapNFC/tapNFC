'use client';
import { Bell, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { nanoid } from 'nanoid';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Search Bar Component
type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const SearchBar = ({ ref, placeholder = 'Search...', value, onChange, className }: SearchBarProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4"
      />
    </div>
  );
};

SearchBar.displayName = 'SearchBar';

// Notification Bell Component
type NotificationBellProps = {
  count?: number;
  onClick?: () => void;
  className?: string;
};

const NotificationBell = ({ ref, count = 0, onClick, className }: NotificationBellProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn('relative', className)}
      onClick={onClick}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <Bell className="size-5" />
      {count > 0 && (
        <Badge
          variant="error"
          className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Button>
  );
};

NotificationBell.displayName = 'NotificationBell';

// User Menu Component
type UserMenuProps = {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onSignOut?: () => void;
  className?: string;
};

const UserMenu = (
  { ref, user, onProfileClick, onSettingsClick, onSignOut, className }: UserMenuProps & { ref?: React.RefObject<HTMLDivElement | null> },
) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('relative h-10 w-10 rounded-full', className)}
          ref={ref as unknown as React.RefObject<HTMLButtonElement>}
        >
          <Avatar className="size-10">
            <AvatarImage src={user.avatar ?? ''} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onProfileClick}>
          <User className="mr-2 size-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSettingsClick}>
          <Settings className="mr-2 size-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 size-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

UserMenu.displayName = 'UserMenu';

export type HeaderProps = {
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  onMenuClick?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  notificationCount?: number;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const Header = (
  { ref, className, showSearch = true, showNotifications = true, showUserMenu = true, onMenuClick, user, notificationCount = 0, searchPlaceholder = 'Search...', onSearch, children, ...props }: HeaderProps & { ref?: React.RefObject<HTMLDivElement | null> },
) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header
      ref={ref}
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
      {...props}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
              aria-label="Toggle menu"
            >
              <Menu className="size-5" />
            </Button>
          )}

          {children}
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="mx-4 max-w-md flex-1">
            <SearchBar
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {showNotifications && (
            <NotificationBell count={notificationCount} />
          )}

          {showUserMenu && user && (
            <UserMenu user={user} />
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

// Header Actions Component
type HeaderActionsProps = {} & React.HTMLAttributes<HTMLDivElement>;

const HeaderActions = ({ ref, className, children, ...props }: HeaderActionsProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center space-x-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};

HeaderActions.displayName = 'HeaderActions';

// Breadcrumb Component
type BreadcrumbProps = {
  items: Array<{
    label: string;
    href?: string;
  }>;
  separator?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const Breadcrumb = ({ ref, className, items, separator = '/', ...props }: BreadcrumbProps & { ref?: React.RefObject<HTMLElement | null> }) => {
  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      {...props}
    >
      {items.map((item, index) => (
        <React.Fragment key={nanoid()}>
          {index > 0 && (
            <span className="mx-2" aria-hidden="true">
              {separator}
            </span>
          )}
          {item.href
            ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              )
            : (
                <span
                  className={cn(
                    index === items.length - 1 && 'text-foreground font-medium',
                  )}
                >
                  {item.label}
                </span>
              )}
        </React.Fragment>
      ))}
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export {
  Breadcrumb,
  Header,
  HeaderActions,
  NotificationBell,
  SearchBar,
  UserMenu,
};
