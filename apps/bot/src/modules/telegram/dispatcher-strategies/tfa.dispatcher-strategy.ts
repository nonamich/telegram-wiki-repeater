import { WikiArticle } from '~/modules/wiki/types';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class TFADispatcherStrategy extends BaseDispatcherStrategy<WikiArticle> {
  getAdditionalSkipParams() {
    return {
      ids: this.props.data.pageid,
      type: 'tfa' as const,
    };
  }

  isShowTime() {
    return new Date().getHours() >= 12;
  }

  async isSkip() {
    return !this.isShowTime() || (await super.isSkip());
  }

  async send() {
    await this.sender.sendFeaturedArticle(this.props.chatId, this.props.data);
  }
}
