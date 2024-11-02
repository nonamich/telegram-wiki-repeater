import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { DBModule } from './db/db.module';
import { GlobalModule } from './global.module';
import { ImagesModule } from './images/images.module';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramOptionsFactory } from './telegram/telegram.options-factory';

@Module({
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
