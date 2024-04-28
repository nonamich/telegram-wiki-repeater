import { Module } from '@nestjs/common';

import { TelegrafModule } from 'nestjs-telegraf';

import { WikiModule } from '~/modules/wiki/wiki.module';

import { TelegramOptionsFactory } from './telegram.options-factory';
import { TelegramSender } from './telegram.sender';
import { TelegramService } from './telegram.service';
import { TelegramSessionStore } from './telegram.session-store';
import { TelegramUpdate } from './telegram.update';
import { TelegramViews } from './views/telegram.view';

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
    WikiModule,
  ],
  providers: [TelegramUpdate, TelegramService, TelegramSender, TelegramViews],
})
export class TelegramModule {}
