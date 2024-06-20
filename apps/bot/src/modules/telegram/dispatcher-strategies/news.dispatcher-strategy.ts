import crypto from 'node:crypto';

import { DAY_IN_SEC } from '~/modules/redis/redis.constants';
import { WikiNews } from '~/modules/wiki/types';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class NewsDispatcherStrategy extends BaseDispatcherStrategy<WikiNews> {
  getAdditionalSkipParams() {
    return {
      ids: crypto.createHash('md5').update(this.props.data.story).digest('hex'),
      type: 'news' as const,
      expireInSec: DAY_IN_SEC * 3,
    };
  }

  async send() {
    await this.sender.sendNews(this.props.chatId, this.props.data);
  }
}
