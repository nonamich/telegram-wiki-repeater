import { WikiFeaturedImage } from '~/modules/wiki/interfaces';

import { TelegramShowTime } from '../telegram.show-time';
import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class TFIDispatcherStrategy extends BaseDispatcherStrategy<WikiFeaturedImage> {
  getSkipParams() {
    return {
      ids: this.data.wb_entity_id,
      type: 'tfi' as const,
    };
  }

  async isSkip() {
    return !TelegramShowTime.isFeaturedImage() || (await super.isSkip());
  }

  async send() {
    await this.sender.sendFeaturedImage(this.chatId, this.data);
  }
}
