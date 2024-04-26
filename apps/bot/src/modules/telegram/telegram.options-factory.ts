import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import { session } from 'telegraf';

import { Utils } from '@repo/shared';

import { TelegramSessionStore } from './telegram.session-store';

@Injectable()
export class TelegramOptionsFactory implements TelegrafOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly store: TelegramSessionStore,
  ) {}

  createTelegrafOptions(): TelegrafModuleOptions {
    const options: TelegrafModuleOptions = {
      token: this.config.getOrThrow('TELEGRAM_BOT_TOKEN'),
      middlewares: [session({ store: this.store })],
    };

    if (!Utils.isDev) {
      options.launchOptions = {
        webhook: {
          domain: this.config.getOrThrow('TELEGRAM_WEBHOOK_DOMAIN'),
          hookPath: this.config.getOrThrow('TELEGRAM_WEBHOOK_SECRET'),
        },
      };
    }

    return options;
  }
}
