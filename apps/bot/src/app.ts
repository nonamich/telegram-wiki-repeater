import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { AppModule } from './modules/app.module';
import { AdminGuard } from './modules/telegram/guards/admin.guard';

export const createApp = async () => {
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalGuards(new AdminGuard(config));

  return app;
};
