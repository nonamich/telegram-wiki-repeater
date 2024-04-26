import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';

import { Utils } from '@repo/shared';

import { RedisService } from '~/modules/redis/redis.service';
import { WikiModule } from '~/modules/wiki/wiki.module';

import { i18nextMiddleware } from './i18n/telegram.i18n.middleware';
import { TelegramI18nService } from './i18n/telegram.i18n.service';
import { sessionMiddleware } from './middlewares/session.middleware';
import { GreeterScene } from './scenes/greeter.scene';
import { TelegramChatService } from './telegram.chat.service';
import { BOT_NAME } from './telegram.constants';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { getSessionStore } from './telegram.utils';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      inject: [ConfigService, RedisService],
      useFactory(config: ConfigService, redis: RedisService) {
        const options: TelegrafModuleOptions = {
          token: config.getOrThrow('TELEGRAM_BOT_TOKEN'),
          middlewares: [
            sessionMiddleware(getSessionStore(redis)),
            i18nextMiddleware(),
          ],
        };

        if (!Utils.isDev) {
          options.launchOptions = {
            webhook: {
              domain: config.getOrThrow('TELEGRAM_WEBHOOK_DOMAIN'),
              hookPath: config.getOrThrow('TELEGRAM_WEBHOOK_SECRET'),
            },
          };
        }

        return options;
      },
    }),
    WikiModule,
  ],
  providers: [
    TelegramService,
    TelegramI18nService,
    TelegramChatService,
    TelegramUpdate,
    GreeterScene,
  ],
})
export class TelegramModule {}
