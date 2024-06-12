import { DAY_IN_SEC } from '~/modules/redis/redis.constants';
import { WikiNews } from '~/modules/wiki/types';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class NewsDispatcherStrategy extends BaseDispatcherStrategy<WikiNews> {
  getAdditionalSkipParams() {
    return {
      ids: this.props.data.links.map(({ pageid }) => pageid),
      type: 'news' as const,
      expireInSec: DAY_IN_SEC * 3,
    };
  }

  async send() {
    await this.sender.sendNews(this.props.chatId, this.props.data);
  }
}
