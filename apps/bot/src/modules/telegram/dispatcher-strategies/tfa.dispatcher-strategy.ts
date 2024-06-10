import { WikiArticle } from '~/modules/wiki/interfaces';

import { TelegramShowTime } from '../telegram.show-time';
import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class TFADispatcherStrategy extends BaseDispatcherStrategy<WikiArticle> {
  getSkipParams() {
    return {
      ids: this.data.pageid,
      type: 'tfa' as const,
    };
  }

  async isSkip() {
    return !TelegramShowTime.isFeaturedImage() || (await super.isSkip());
  }

  async send() {
    await this.sender.sendFeaturedArticle(this.chatId, this.data);
  }
}
