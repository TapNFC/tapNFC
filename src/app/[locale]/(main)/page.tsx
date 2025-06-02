/* eslint-disable no-console */
import { nanoid } from 'nanoid';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  console.log('locale', locale);
  return {
    title: 'CodeHuddle - Modern Web Development Boilerplate',
    description: 'A modern Next.js boilerplate with TypeScript, Tailwind CSS, and authentication built by CodeHuddle.',
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'RootLayout',
  });

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-gray-200 p-6 md:p-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-black transition-colors hover:text-gray-600">
            CodeHuddle
          </Link>
          <a
            href="https://github.com/codehuddle"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 transition-colors hover:text-black"
          >
            GitHub
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            href="/sign-in"
            className="text-gray-600 transition-colors hover:text-black"
          >
            {t('sign_in_link')}
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800"
          >
            {t('sign_up_link')}
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-24 text-center">
          <div className="mb-8">
            <span className="mb-8 inline-block rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600">
              Modern Web Development Boilerplate
            </span>
          </div>

          <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            <span className="mb-2 block text-black">Welcome to</span>
            <span className="block text-black">CodeHuddle</span>
          </h1>

          <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-600 md:text-2xl">
            A production-ready Next.js boilerplate with TypeScript, Tailwind CSS, and authentication.
            <span className="mt-2 block font-medium text-black">Built for developers who want to ship fast.</span>
          </p>

          <div className="mb-20 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-8 py-4 font-medium text-white transition-colors hover:bg-gray-800"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="rounded-md border border-gray-300 px-8 py-4 font-medium text-black transition-colors hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Next.js 15',
              description: 'Built with the latest Next.js App Router for optimal performance and cutting-edge features.',
            },
            {
              title: 'Authentication',
              description: 'Complete authentication system with NextAuth.js including social login and user management.',
            },
            {
              title: 'TypeScript',
              description: 'Fully typed with TypeScript for better development experience and fewer runtime errors.',
            },
            {
              title: 'Tailwind CSS',
              description: 'Beautiful, responsive design with Tailwind CSS and modern UI components.',
            },
            {
              title: 'Internationalization',
              description: 'Multi-language support with next-intl for building global applications.',
            },
            {
              title: 'Developer Tools',
              description: 'ESLint, Prettier, Husky, and comprehensive testing setup for smooth development.',
            },
          ].map(feature => (
            <div
              key={nanoid()}
              className="rounded-lg border border-gray-200 p-8 transition-colors hover:border-gray-300"
            >
              <h3 className="mb-4 text-xl font-semibold text-black">
                {feature.title}
              </h3>

              <p className="leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mb-24 text-center">
          <h2 className="mb-6 text-3xl font-bold text-black md:text-4xl">
            Built with Modern Technologies
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-gray-600">
            Leveraging the best tools and frameworks to ensure your project is scalable, maintainable, and future-proof.
          </p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              'Next.js',
              'React 19',
              'TypeScript',
              'Tailwind',
              'NextAuth',
              'Vitest',
            ].map(tech => (
              <div
                key={nanoid()}
                className="rounded-md border border-gray-200 p-4 text-center font-medium text-black transition-colors hover:border-gray-300"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-16 rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="mb-6 text-3xl font-bold text-black md:text-4xl">
            Ready to Build Something Amazing?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Start your next project with our production-ready boilerplate and ship faster than ever before.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-10 py-4 font-medium text-white transition-colors hover:bg-gray-800"
            >
              Start Building Now
            </Link>
            <a
              href="https://github.com/codehuddle"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-gray-300 px-10 py-4 font-medium text-black transition-colors hover:bg-gray-50"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-12 text-center">
          <p className="text-gray-600">
            Made with ♥ by
            {' '}
            <a
              href="https://github.com/codehuddle"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black transition-colors hover:text-gray-600"
            >
              CodeHuddle
            </a>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Licensed under the MIT License, Copyright © 2024 CodeHuddle.
          </p>
        </div>
      </div>
    </div>
  );
}
