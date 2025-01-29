import { logger } from '@/libs/Logger';
import { CounterValidation } from '@/validations/CounterValidation';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const PUT = async (request: Request) => {
  const json = await request.json();
  const parse = CounterValidation.safeParse(json);

  if (!parse.success) {
    return NextResponse.json(parse.error.format(), { status: 422 });
  }

  // `x-e2e-random-id` is used for end-to-end testing to make isolated requests
  // The default value is 0 when there is no `x-e2e-random-id` header
  const id = Number((await headers()).get('x-e2e-random-id')) ?? 0;

  // Simulated counter increment (remove this if no logic is needed)
  const increment = parse.data.increment;
  const simulatedCount = id + increment; // Example logic, replace as needed

  logger.info('Counter has been incremented (simulated)');

  return NextResponse.json({
    count: simulatedCount,
  });
};
