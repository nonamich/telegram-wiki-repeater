import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';

export const createApp = async () => {
  const app = await NestFactory.create(AppModule);

  return app;
};
