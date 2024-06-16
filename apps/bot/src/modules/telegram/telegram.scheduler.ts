import { Injectable } from '@nestjs/common';

import { DBService } from '~/modules/db/db.service';
import { I18nContext } from '~/modules/i18n/i18n.context';
import { WikiLanguage } from '~/modules/wiki/types';
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
    const args = [this.skipper, this.sender] as const;
    const featuredContent = await this.wiki.getFeaturedContentAsArray(lang);

    await I18nContext.create(lang, async () => {
      for (const [type, data] of featuredContent) {
        let strategy: BaseDispatcherStrategy;
        const baseProps = {
          chatId,
          lang,
        };

        if (type === 'tfi') {
          strategy = new TFIDispatcherStrategy(
            ...[...args, { ...baseProps, data }],
          );
        } else if (type === 'tfa') {
          strategy = new TFADispatcherStrategy(
            ...[...args, { ...baseProps, data }],
          );
        } else if (type === 'mostread') {
          strategy = new MostReadDispatcherStrategy(
            ...[...args, { ...baseProps, data }],
          );
        } else if (type === 'onthisday') {
          strategy = new OnThisDayDispatcherStrategy(
            ...[...args, { ...baseProps, data }],
          );
        } else if (type === 'news') {
          strategy = new NewsDispatcherStrategy(
            ...[...args, { ...baseProps, data }],
          );
        } else {
          break;
        }

        if (await strategy.execute()) {
          break;
        }
      }
    });
  }

  async execute() {
    const channels = await this.db.getProdChannels();

    for (const channel of channels) {
      await this.executeWithI18nContext(channel.id, channel.lang);
    }
  }
}
