import { Module } from '@nestjs/common';

import { TelegrafModule } from 'nestjs-telegraf';

import { I18nModule } from '~/modules/i18n/i18n.module';
import { WikiModule } from '~/modules/wiki/wiki.module';

import { TelegramOptionsFactory } from './telegram.options-factory';
import { TelegramSessionStore } from './telegram.session-store';
import { TelegramUpdate } from './telegram.update';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [
        {
          module: TelegramModule,
          providers: [TelegramOptionsFactory, TelegramSessionStore],
          exports: [TelegramSessionStore],
        },
      ],
      useClass: TelegramOptionsFactory,
    }),
    I18nModule.forFeature(),
    WikiModule,
  ],
  providers: [TelegramUpdate],
})
export class TelegramModule {}
