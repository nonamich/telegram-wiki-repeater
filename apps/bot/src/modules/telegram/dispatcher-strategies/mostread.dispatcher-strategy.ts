import { DAY_IN_SEC } from '~/modules/redis/redis.constants';
import { WikiMostReadArticle } from '~/modules/wiki/interfaces';

import { SkipParams } from '../telegram.types';
import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class MostReadDispatcherStrategy extends BaseDispatcherStrategy<WikiMostReadArticle> {
  async setSkipTotal() {
    await this.skipper.setSkipCache(this.getSkipTotalParams());
  }

  async isSkipTotal() {
    return await this.skipper.isSkip(this.getSkipTotalParams());
  }

  getSkipTotalParams(): SkipParams {
    return {
      chatId: this.chatId,
      ids: 'total',
      type: 'mostread',
      expireInSec: DAY_IN_SEC,
    };
  }

  getSkipParams() {
    return {
      ids: this.data.pageid,
      type: 'mostread' as const,
      expireInSec: DAY_IN_SEC * 5,
    };
  }

  async isSkip(): Promise<boolean> {
    return (await this.isSkipTotal()) || (await super.isSkip());
  }

  async send() {
    await this.sender.sendMostReadArticle(this.chatId, this.data);

    await this.setSkipTotal();
  }
}
