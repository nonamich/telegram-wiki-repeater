import { Logger } from '@nestjs/common';

import memoize from 'lodash.memoize';

import { createApp } from './app';
import { TelegramScheduler } from './modules/telegram/telegram.scheduler';

export async function handler() {
  const app = await memoize(() => {
    Logger.log('creating app');

    return createApp();
  })();

  const scheduler = app.get(TelegramScheduler);

  return scheduler.execute();
}
