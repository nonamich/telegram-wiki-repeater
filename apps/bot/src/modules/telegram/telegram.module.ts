import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegrafModule } from 'nestjs-telegraf';

import { CacheService } from '~/modules/cache/cache.service';
import { WikiModule } from '~/modules/wiki/wiki.module';

import { i18nextMiddleware } from './i18n/telegram.i18n.middleware';
import { sessionMiddleware } from './middlewares/session.middleware';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { getSessionStore } from './telegram.utils';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ConfigService, CacheService],
      useFactory(config: ConfigService, { redis }: CacheService) {
        return {
          token: config.getOrThrow('TELEGRAM_BOT_TOKEN'),
          middlewares: [
            sessionMiddleware(getSessionStore(redis)),
            i18nextMiddleware(),
          ],
        };
      },
    }),
    WikiModule,
  ],
  providers: [TelegramUpdate, TelegramService],
})
export class TelegramModule {}
