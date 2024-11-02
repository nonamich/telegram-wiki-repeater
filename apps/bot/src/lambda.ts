import './instrument';

import * as Sentry from '@sentry/aws-serverless';

import { createNestApp } from './app';
import { TelegramScheduler } from './modules/telegram/telegram.scheduler';

export const handler = Sentry.wrapHandler(async () => {
  const app = await createNestApp();

  await app.init();

  const scheduler = app.get(TelegramScheduler);

  await scheduler.execute();
  await app.close();
});
