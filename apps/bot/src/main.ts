import { NestFactory } from '@nestjs/core';

import { AppModule } from '~/modules/app.module';

main();

async function main() {
  await NestFactory.createApplicationContext(AppModule);
}
