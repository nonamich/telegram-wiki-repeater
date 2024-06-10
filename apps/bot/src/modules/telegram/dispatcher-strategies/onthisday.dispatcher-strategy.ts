import { WikiOnThisDay } from '~/modules/wiki/interfaces';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class OnThisDayDispatcherStrategy extends BaseDispatcherStrategy<WikiOnThisDay> {
  getSkipParams() {
    return {
      ids: this.data.pages.slice(0, 3).map(({ pageid }) => pageid),
      type: 'onthisday' as const,
    };
  }

  async send() {
    await this.sender.sendOnThisDay(this.chatId, this.data);
  }
}
