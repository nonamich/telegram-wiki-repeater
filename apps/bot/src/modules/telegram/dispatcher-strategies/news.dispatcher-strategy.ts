import { WikiNews } from '~/modules/wiki/interfaces';

import { BaseDispatcherStrategy } from './base.dispatcher-strategy';

export class NewsDispatcherStrategy extends BaseDispatcherStrategy<WikiNews> {
  getSkipParams() {
    return {
      ids: this.data.links.slice(0, 3).map(({ pageid }) => pageid),
      type: 'news' as const,
    };
  }

  async send() {
    await this.sender.sendNews(this.chatId, this.data);
  }
}
