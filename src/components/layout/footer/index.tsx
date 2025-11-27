'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { footerClassName } from './styles';

type FooterProps = {
  locale: string;
};

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const pathname = usePathname();

  // Hide footer on design editor routes like /[locale]/design/[id] and /design/[id] (no-locale)
  if (!pathname || !pathname.includes('/dashboard')) {
    return null;
  }

  return (
    <footer
      id="site-footer"
      className={footerClassName}
    >
      <p>
        Icons and logos are licensed under MIT, Apache 2.0 (modifications made where applicable), CC0/Public Domain,
        {' '}
        and official brand guidelines. Full details are available on our
        {' '}
        <a
          href={`/${locale}/credits`}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Credits &amp; Licenses
        </a>
        {' '}
        page.
      </p>
    </footer>
  );
};
