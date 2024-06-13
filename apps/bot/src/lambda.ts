import { getLaunchedApp } from './app';
import { TelegramScheduler } from './modules/telegram/telegram.scheduler';

export async function handler() {
  const app = await getLaunchedApp();

  const scheduler = app.get(TelegramScheduler);

  await scheduler.execute();
  await app.close();
}
