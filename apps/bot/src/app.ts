import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';
import { AdminGuard } from './modules/telegram/guards/admin.guard';

export const getLaunchedApp = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalGuards(new AdminGuard(configService));

  return await app.init();
};
