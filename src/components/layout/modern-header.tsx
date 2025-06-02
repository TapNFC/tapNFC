'use client';

import { motion } from 'framer-motion';
import {
  ChevronDown,
  Command,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
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

type ModernHeaderProps = {
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
};

export function ModernHeader({ className, user }: ModernHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-slate-200/60 backdrop-blur-xl',
        'bg-white/80 dark:bg-slate-900/80 dark:border-slate-700/60',
        'shadow-sm shadow-slate-200/20 dark:shadow-slate-900/20',
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Search */}
        <div className="flex max-w-md flex-1 items-center space-x-4">
          <motion.div
            className="relative w-full"
            animate={{
              scale: isSearchFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search QR codes, templates, customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                'pl-10 pr-12 h-10 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
                'focus:bg-white dark:focus:bg-slate-800 focus:border-primary/50 focus:ring-primary/20',
                'transition-all duration-200',
              )}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center space-x-1">
              <kbd className="hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
                <Command className="size-3" />
                K
              </kbd>
            </div>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <Button
            size="sm"
            className="hidden items-center space-x-2 bg-gradient-to-r from-primary to-primary-blue-dark text-white shadow-lg shadow-primary/25 hover:from-primary-blue-dark hover:to-primary sm:flex"
          >
            <Plus className="size-4" />
            <span>Create Template</span>
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-auto rounded-lg px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="size-8 ring-2 ring-primary/20">
                      <AvatarImage src={user.avatar ?? ''} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.name.split(' ')[0]}
                      </p>
                    </div>
                    <ChevronDown className="size-3 text-slate-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Zap className="mr-2 size-4" />
                  <span>Upgrade Plan</span>
                  <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-amber-500 to-orange-500 text-xs text-white">
                    Pro
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
