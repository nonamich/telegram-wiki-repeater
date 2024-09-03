import { config } from 'dotenv';

import * as Sentry from '@sentry/aws-serverless';

const { parsed: envs } = config({
  path: '.env',
});

if (!envs) {
  throw new Error('Cannot parse env for an unknown reason');
}

Sentry.init({
  dsn: envs.SENTRY_DATA_SOURCE_NAME,
});
