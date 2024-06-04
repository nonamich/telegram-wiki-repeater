import { Injectable } from '@nestjs/common';

import { RedisService } from '~/modules/redis/redis.service';

import { DBService } from '../db/db.service';
import { I18nContext } from '../i18n/i18n.context';
import { WikiLanguage } from '../wiki/interfaces';
import { WikiService } from '../wiki/wiki.service';
import { TELEGRAM_MAX_POST_PER_TIME } from './telegram.constants';
import { TelegramSender } from './telegram.sender';
import { TelegramShowTime } from './telegram.show-time';
import { ChatId } from './telegram.types';

@Injectable()
export class TelegramScheduler {
  skipKey = 'scheduler:is-skip';

  constructor(
    private readonly redis: RedisService,
    private readonly db: DBService,
    private readonly wiki: WikiService,
    private readonly sender: TelegramSender,
  ) {}

  async getSkip() {
    return await this.redis.get(this.skipKey);
  }

  async setSkip() {
    await this.redis.setex(this.skipKey, TELEGRAM_MAX_POST_PER_TIME, 'true');
  }

  async isSkip() {
    return !TelegramShowTime.isTime() || (await this.getSkip());
  }

  async executeWithContext(chatId: ChatId, lang: WikiLanguage) {
    const { image, mostread, news, onthisday, tfa } =
      await this.wiki.getFeaturedContent(
        this.wiki.getFeaturedRequestParams(lang),
      );

    await I18nContext.create(lang, async () => {
      if (image && TelegramShowTime.isFeaturedImage()) {
        await this.sender.sendFeaturedImage(chatId, image);
      } else if (tfa && TelegramShowTime.isFeaturedArticle()) {
        await this.sender.sendFeaturedArticle(chatId, tfa);
      } else if (mostread) {
      }
    });
  }

  async execute() {
    if (await this.isSkip()) {
      return;
    }

    const channels = await this.db.getChannels();

    for (const channel of channels) {
      await this.executeWithContext(channel.id, channel.lang);
    }

    await this.setSkip();
  }
}
