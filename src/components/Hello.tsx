import { auth } from 'auth';
import { getTranslations } from 'next-intl/server';
import { Sponsors } from './Sponsors';

export const Hello = async () => {
  // Fetch translations
  const t = await getTranslations('Dashboard');

  // Fetch the session using auth()
  const session = await auth();

  // Default email if the user is not logged in
  const userEmail = session?.user?.email || 'anonymous@example.com';

  return (
    <>
      <p>
        {`👋 `}
        {t('hello_message', { email: userEmail })}
      </p>
      <p>
        {t.rich('alternative_message', {
          url: () => (
            <a
              className="text-blue-700 hover:border-b-2 hover:border-blue-700"
              href="https://nextjs-boilerplate.com/pro-saas-starter-kit"
            >
              Next.js Boilerplate SaaS
            </a>
          ),
        })}
      </p>
      {/* Optionally render more user details */}
      {session?.user && (
        <div>
          <p>
            Name:
            {session.user.name}
          </p>
          <p>
            Email:
            {session.user.email}
          </p>
        </div>
      )}
      <Sponsors />
    </>
  );
};
