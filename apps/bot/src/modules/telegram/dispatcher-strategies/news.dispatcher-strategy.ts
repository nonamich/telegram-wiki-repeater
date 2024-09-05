import { Utils } from '@repo/shared';

import { REDIS_DAY_IN_SEC } from '~/modules/redis/redis.constants';
import { WikiNews } from '~/modules/wiki/types';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class NewsDispatcherStrategy extends BaseDispatcherStrategy<WikiNews> {
  getAdditionalSkipParams() {
    return {
      ids: Utils.creteMD5Hash(this.props.data.story),
      type: 'news' as const,
      expireInSec: REDIS_DAY_IN_SEC * 3,
    };
  }

  async send() {
    await this.sender.sendNews(this.props.chatId, this.props.data);
  }
}
