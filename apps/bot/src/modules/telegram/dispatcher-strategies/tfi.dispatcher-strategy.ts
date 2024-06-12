import { WikiFeaturedImage } from '~/modules/wiki/types';

import { TelegramShowTime } from '../telegram.show-time';
import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class TFIDispatcherStrategy extends BaseDispatcherStrategy<WikiFeaturedImage> {
  getAdditionalSkipParams() {
    return {
      ids: this.props.data.wb_entity_id,
      type: 'tfi' as const,
    };
  }

  async isSkip() {
    return !TelegramShowTime.isFeaturedImage() || (await super.isSkip());
  }

  async send() {
    await this.sender.sendFeaturedImage(this.props.chatId, this.props.data);
  }
}
