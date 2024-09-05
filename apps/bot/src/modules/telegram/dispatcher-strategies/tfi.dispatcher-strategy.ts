import { WikiFeaturedImage } from '~/modules/wiki/types';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class TFIDispatcherStrategy extends BaseDispatcherStrategy<WikiFeaturedImage> {
  getAdditionalSkipParams() {
    return {
      ids: this.props.data.wb_entity_id,
      type: 'tfi' as const,
    };
  }

  getShowTime() {
    return new Date().getHours() >= 12;
  }

  async isSkip() {
    return !this.getShowTime() || (await super.isSkip());
  }

  async send() {
    await this.sender.sendFeaturedImage(this.props.chatId, this.props.data);
  }
}
