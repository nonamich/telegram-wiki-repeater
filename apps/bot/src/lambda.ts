import { initApp } from './app';
import { TelegramScheduler } from './modules/telegram/telegram.scheduler';

export async function handler() {
  const app = await initApp();

  const scheduler = app.get(TelegramScheduler);

  await scheduler.execute();
  await app.close();
}
