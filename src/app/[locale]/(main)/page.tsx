import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Redirect to the dashboard page
  redirect(`/${locale}/dashboard`);
}
