import { Injectable } from '@nestjs/common';

import { DBService } from '~/modules/db/db.service';
import { I18nContext } from '~/modules/i18n/i18n.context';
import { WikiLanguage } from '~/modules/wiki/interfaces';
import { WikiService } from '~/modules/wiki/wiki.service';

import {
  BaseDispatcherStrategy,
  MostReadDispatcherStrategy,
  NewsDispatcherStrategy,
  OnThisDayDispatcherStrategy,
  TFADispatcherStrategy,
  TFIDispatcherStrategy,
} from './dispatcher-strategies';
import { TelegramSender } from './telegram.sender';
import { TelegramShowTime } from './telegram.show-time';
import { ChatId } from './telegram.types';
import { TelegramSkipper } from './with-i18n-context/telegram.skipper';

@Injectable()
export class TelegramScheduler {
  constructor(
    private readonly db: DBService,
    private readonly wiki: WikiService,
    private readonly sender: TelegramSender,
    private readonly skipper: TelegramSkipper,
  ) {}

  async isSkip() {
    return !TelegramShowTime.isTime();
  }

  async executeWithContext(chatId: ChatId, lang: WikiLanguage) {
    const args = [this.skipper, this.sender, chatId] as const;

    await I18nContext.create(lang, async () => {
      for (const [type, data] of await this.wiki.getFeaturedContentAsArray(
        lang,
      )) {
        let strategy: BaseDispatcherStrategy;

        switch (type) {
          case 'tfi':
            strategy = new TFIDispatcherStrategy(...[...args, data]);
            break;
          case 'tfa':
            strategy = new TFADispatcherStrategy(...[...args, data]);
            break;
          case 'news':
            strategy = new NewsDispatcherStrategy(...[...args, data]);
            break;
          case 'mostread':
            strategy = new MostReadDispatcherStrategy(...[...args, data]);
            break;
          case 'onthisday':
            strategy = new OnThisDayDispatcherStrategy(...[...args, data]);
            break;
        }

        await strategy.execute();

        if (strategy.isSended) {
          break;
        }
      }
    });
  }

  async execute() {
    const channels = await this.db.getChannels();

    for (const channel of channels) {
      await this.executeWithContext(channel.id, channel.lang);
    }
  }
}
