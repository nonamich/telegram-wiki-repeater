import * as Sentry from '@sentry/aws-serverless';

import { createNestApp } from './app';
import { TelegramScheduler } from './modules/telegram/telegram.scheduler';

Sentry.init({
  dsn: 'https://e26c2201258d3b66c33c88251036f008@o4507301057658880.ingest.de.sentry.io/4507553132773456',
});

export const handler = Sentry.wrapHandler(async () => {
  const app = await createNestApp();

  const scheduler = app.get(TelegramScheduler);

  await scheduler.execute();
  await app.close();
});
