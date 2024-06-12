import { createApp } from './app';
import { TelegramScheduler } from './modules/telegram/telegram.scheduler';

export async function handler() {
  const app = await createApp();

  await app.init();

  const scheduler = app.get(TelegramScheduler);

  await scheduler.execute();
  await app.close();
}
