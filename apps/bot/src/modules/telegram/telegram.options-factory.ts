import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import { Telegraf, session } from 'telegraf';

import { TelegramSessionStore } from './telegram.session-store';

@Injectable()
export class TelegramOptionsFactory implements TelegrafOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly store: TelegramSessionStore,
  ) {}

  createTelegrafOptions(): TelegrafModuleOptions {
    const launchOptions: Telegraf.LaunchOptions = {
      dropPendingUpdates: true,
    };

    const options: TelegrafModuleOptions = {
      token: this.config.getOrThrow('TELEGRAM_BOT_TOKEN'),
      middlewares: [session({ store: this.store })],
      launchOptions,
      options: {
        telegram: {
          webhookReply: false,
        },
      },
    };

    return options;
  }
}
