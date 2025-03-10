import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';

export const createNestApp = async () => {
  return await NestFactory.create(AppModule);
};
