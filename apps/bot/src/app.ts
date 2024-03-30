import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';

export const createApp = () => {
  return NestFactory.createApplicationContext(AppModule);
};
