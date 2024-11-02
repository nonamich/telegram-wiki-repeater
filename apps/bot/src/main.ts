import { createNestApp } from './app';
import { TelegramExceptionFilter } from './modules/telegram/filters/telegram-exception.filter';

main();

async function main() {
  const app = await createNestApp();

  app.useGlobalFilters(new TelegramExceptionFilter());

  await app.init();
}
