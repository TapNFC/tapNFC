import type { ComponentPropsWithoutRef } from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';

export type LinkProps = {
  className?: string;
} & ComponentPropsWithoutRef<typeof NextLink>;

const Link = ({ ref, className, children, ...props }: LinkProps & { ref?: React.RefObject<HTMLAnchorElement | null> }) => {
  return (
    <NextLink
      className={cn(
        'transition-colors hover:text-gray-900 dark:hover:text-gray-100',
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </NextLink>
  );
};

Link.displayName = 'Link';

export { Link };
