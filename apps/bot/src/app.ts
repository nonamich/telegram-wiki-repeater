import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';
import { TelegramExceptionFilter } from './modules/telegram/filters/telegram.exception.filter';
import { AdminGuard } from './modules/telegram/guards/admin.guard';

export const initApp = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalGuards(new AdminGuard(configService));
  app.useGlobalFilters(new TelegramExceptionFilter());

  return await app.init();
};
