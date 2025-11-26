import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter, Lato, Montserrat, Open_Sans, Pinyon_Script, Poppins, Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import arcjet, { detectBot, request } from '@/libs/Arcjet';
import { Env } from '@/libs/Env';
import { routing } from '@/libs/i18nNavigation';
import '@/styles/global.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-open-sans',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const pinyonScript = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pinyon-script',
  display: 'swap',
});

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    // Block all bots except the following
    allow: [
      // See https://docs.arcjet.com/bot-protection/identifying-bots
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Verify the request with Arcjet
  if (Env.ARCJET_KEY) {
    const req = await request();
    const decision = await aj.protect(req);

    // These errors are handled by the global error boundary, but you could also
    // redirect or show a custom error page
    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        throw new Error('No bots allowed');
      }

      throw new Error('Access denied');
    }
  }

  // Using internationalization in Client Components
  const messages = await getMessages();

  // The `suppressHydrationWarning` attribute in <body> is used to prevent hydration errors caused by Sentry Overlay,
  // which dynamically adds a `style` attribute to the body tag.

  return (
    <html lang={locale} className={`${poppins.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${pinyonScript.variable}`}>
      <body suppressHydrationWarning>
        <QueryProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
          >
            <div className="flex min-h-screen flex-col">
              <div className="flex-1">
                {props.children}
              </div>
              <Footer locale={locale} />
            </div>
            <Toaster />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
