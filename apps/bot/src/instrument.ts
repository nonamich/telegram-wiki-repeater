import { config } from 'dotenv';

import * as Sentry from '@sentry/aws-serverless';

const { parsed: envs } = config({
  path: '.env',
});

if (!envs) {
  throw new Error('NOT_FOUND_DOTENV_ENVIRONMENT');
}

Sentry.init({
  dsn: envs.SENTRY_DATA_SOURCE_NAME,
});
