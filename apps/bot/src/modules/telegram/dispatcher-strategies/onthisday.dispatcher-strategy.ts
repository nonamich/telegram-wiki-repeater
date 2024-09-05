import { Utils } from '@repo/shared';

import { WikiOnThisDay } from '~/modules/wiki/types';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class OnThisDayDispatcherStrategy extends BaseDispatcherStrategy<WikiOnThisDay> {
  getAdditionalSkipParams() {
    const { pages, text } = this.props.data;
    const ids =
      pages.length > 0 ? pages.at(0)!.pageid : Utils.creteMD5Hash(text);

    return {
      ids,
      type: 'onthisday' as const,
    };
  }

  async send() {
    await this.sender.sendOnThisDay(this.props.chatId, this.props.data);
  }
}
