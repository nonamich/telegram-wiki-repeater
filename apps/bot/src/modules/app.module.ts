import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { DBModule } from './db/db.module';
import { GlobalModule } from './global.module';
import { I18nModule } from './i18n/i18n.module';
import { ImagesModule } from './images/images.module';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramOptionsFactory } from './telegram/telegram.options-factory';

@Module({
  imports: [
    GlobalModule,
    DBModule.forRoot(),
    I18nModule,
    TelegrafModule.forRootAsync({
      imports: [TelegramModule],
      useClass: TelegramOptionsFactory,
    }),
    ImagesModule,
  ],
})
export class AppModule {}
