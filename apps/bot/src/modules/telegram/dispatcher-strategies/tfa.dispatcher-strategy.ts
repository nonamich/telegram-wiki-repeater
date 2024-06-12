import { WikiArticle } from '~/modules/wiki/types';

import { TelegramShowTime } from '../telegram.show-time';
import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class TFADispatcherStrategy extends BaseDispatcherStrategy<WikiArticle> {
  getAdditionalSkipParams() {
    return {
      ids: this.props.data.pageid,
      type: 'tfa' as const,
    };
  }

  async isSkip() {
    return !TelegramShowTime.isFeaturedArticle() || (await super.isSkip());
  }

  async send() {
    await this.sender.sendFeaturedArticle(this.props.chatId, this.props.data);
  }
}
