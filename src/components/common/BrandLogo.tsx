import Image from 'next/image';
import { cn } from '@/lib/utils';

export type BrandLogoProps = {
  showText?: boolean;
  label?: string;
  tagline?: string | null;
  imageSize?: number;
  priority?: boolean;
  imageClassName?: string;
  textClassName?: string;
  taglineClassName?: string;
  direction?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>;

const sizeWrapperClasses: Record<'horizontal' | 'vertical', string> = {
  horizontal: 'gap-3',
  vertical: 'gap-2 text-center',
};

export function BrandLogo({
  showText = false,
  label = 'QR Studio',
  tagline = 'Professional',
  imageSize = 48,
  priority = false,
  className,
  imageClassName,
  textClassName,
  taglineClassName,
  direction = 'horizontal',
  ...props
}: BrandLogoProps) {
  const displayTagline = tagline ?? undefined;

  return (
    <div
      className={cn(
        'flex items-center',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        sizeWrapperClasses[direction],
        className,
      )}
      {...props}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: imageSize, height: imageSize }}
      >
        <Image
          src="/logo.jpeg"
          alt={`${label} logo`}
          width={imageSize}
          height={imageSize}
          priority={priority}
          className={cn('size-full object-contain', imageClassName)}
        />
      </div>

      {showText && (
        <div className={cn('leading-tight text-left', direction === 'vertical' && 'text-center')}>
          <p className={cn('text-base font-semibold text-slate-900 dark:text-white', textClassName)}>
            {label}
          </p>
          {displayTagline && (
            <p className={cn('text-xs text-slate-500 dark:text-slate-400', taglineClassName)}>
              {displayTagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
