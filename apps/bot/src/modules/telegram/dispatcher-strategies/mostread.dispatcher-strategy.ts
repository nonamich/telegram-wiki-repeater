import { DAY_IN_SEC } from '~/modules/redis/redis.constants';
import { WikiMostReadArticle } from '~/modules/wiki/types';

import { SkipParams } from '../telegram.types';
import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class MostReadDispatcherStrategy extends BaseDispatcherStrategy<WikiMostReadArticle> {
  static isSkipTotal = new Set<string | number>();

  async setSkipTotal() {
    MostReadDispatcherStrategy.isSkipTotal.add(this.props.chatId);

    await this.skipper.setSkipCache(this.getTotalSkipParams());
  }

  async isSkipTotal() {
    if (MostReadDispatcherStrategy.isSkipTotal.has(this.props.chatId)) {
      return true;
    }

    const isSkipped = await this.skipper.isSkip(this.getTotalSkipParams());

    if (isSkipped) {
      MostReadDispatcherStrategy.isSkipTotal.add(this.props.chatId);
    }

    return isSkipped;
  }

  getTotalSkipParams(): SkipParams {
    return {
      ...this.getBaseSlipParams(),
      ids: 'total',
      type: 'mostread',
      expireInSec: DAY_IN_SEC,
    };
  }

  getAdditionalSkipParams() {
    return {
      ids: this.props.data.pageid,
      type: 'mostread' as const,
      expireInSec: DAY_IN_SEC * 5,
    };
  }

  async isSkip(): Promise<boolean> {
    return (await this.isSkipTotal()) || (await super.isSkip());
  }

  async send() {
    await this.sender.sendMostReadArticle(this.props.chatId, this.props.data);

    await this.setSkipTotal();
  }
}
