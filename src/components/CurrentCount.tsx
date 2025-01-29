import { logger } from '@/libs/Logger';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';

export const CurrentCount = async () => {
  const t = await getTranslations('CurrentCount');

  // `x-e2e-random-id` is used for end-to-end testing to make isolated requests
  // The default value is 0 when there is no `x-e2e-random-id` header
  const id = Number((await headers()).get('x-e2e-random-id')) ?? 0;

  // Simulated count (replace this logic as needed)
  const simulatedCount = id * 2; // Example logic

  logger.info('Counter fetched successfully (simulated)');

  return (
    <div>
      {t('count', { count: simulatedCount })}
    </div>
  );
};
