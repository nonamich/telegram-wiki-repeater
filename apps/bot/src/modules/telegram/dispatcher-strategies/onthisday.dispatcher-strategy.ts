import { WikiOnThisDay } from '~/modules/wiki/types';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class OnThisDayDispatcherStrategy extends BaseDispatcherStrategy<WikiOnThisDay> {
  getAdditionalSkipParams() {
    return {
      ids: this.props.data.pages.map(({ pageid }) => pageid),
      type: 'onthisday' as const,
    };
  }

  async send() {
    await this.sender.sendOnThisDay(this.props.chatId, this.props.data);
  }
}
