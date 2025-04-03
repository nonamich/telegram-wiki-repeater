import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/aws-serverless';

import { Utils } from '@repo/shared';

import { DBService } from '~/modules/db/db.service';
import { I18nContext } from '~/modules/i18n/i18n.context';
import { OrderOfArticles, WikiLanguage } from '~/modules/wiki/types';
import { WikiService } from '~/modules/wiki/wiki.service';

import {
  BaseDispatcherStrategy,
  OnThisDayDispatcherStrategy,
  TFADispatcherStrategy,
  TFIDispatcherStrategy,
} from './dispatcher-strategies';
import { TelegramSender } from './telegram.sender';
import { TelegramSkipper } from './telegram.skipper';
import { ChatId } from './telegram.types';

@Injectable()
export class TelegramScheduler {
  constructor(
    private readonly db: DBService,
    private readonly wiki: WikiService,
    private readonly sender: TelegramSender,
    private readonly skipper: TelegramSkipper,
  ) {}

  async executeWithI18nContext(chatId: ChatId, lang: WikiLanguage) {
    const featuredContent = await this.wiki.getFeaturedContentAsArray(lang);

    for (const item of featuredContent) {
      const strategy = this.getDispatcherStrategy(chatId, lang, item);

      await I18nContext.create(lang, async () => {
        await strategy.execute();
      });

      if (strategy.isExecuted) {
        break;
      }
    }
  }

  getDispatcherStrategy(
    chatId: ChatId,
    lang: WikiLanguage,
    [type, data]: OrderOfArticles[number],
  ): BaseDispatcherStrategy {
    const baseProps = {
      chatId,
      lang,
    };

    switch (type) {
      case 'tfi':
        return new TFIDispatcherStrategy(this.skipper, this.sender, {
          ...baseProps,
          data,
        });
      case 'tfa':
        return new TFADispatcherStrategy(this.skipper, this.sender, {
          ...baseProps,
          data,
        });
      case 'onthisday':
        return new OnThisDayDispatcherStrategy(this.skipper, this.sender, {
          ...baseProps,
          data,
        });
    }
  }

  async execute() {
    const channels = await this.db.getProdChannels();

    for (const channel of channels) {
      try {
        await this.executeWithI18nContext(channel.id, channel.lang);
      } catch (err) {
        if (!Utils.isDev) {
          Sentry.captureException(err);
        }
      }
    }
  }
}
