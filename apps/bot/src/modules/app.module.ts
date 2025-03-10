import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TelegrafModule } from 'nestjs-telegraf';

import { DBModule } from './db/db.module';
import { GlobalModule } from './global.module';
import { ImagesModule } from './images/images.module';
import { AdminGuard } from './telegram/guards/admin.guard';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramOptionsFactory } from './telegram/telegram.options-factory';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
  imports: [
    GlobalModule,
    DBModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [TelegramModule],
      useClass: TelegramOptionsFactory,
    }),
    ImagesModule,
  ],
})
export class AppModule {}
