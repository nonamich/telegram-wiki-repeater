import { REDIS_DAY_IN_SEC } from '~/modules/redis/redis.constants';

import { TelegramSender } from '../telegram.sender';
import { TelegramSkipper } from '../telegram.skipper';
import { ChatId, SkipParams } from '../telegram.types';

type Props<T> = {
  chatId: ChatId;
  data: T;
};

export abstract class BaseDispatcherStrategy<T extends object = object> {
  isExecuted = false;

  constructor(
    readonly skipper: TelegramSkipper,
    readonly sender: TelegramSender,
    readonly props: Props<T>,
  ) {}

  abstract getAdditionalSkipParams(): Pick<SkipParams, 'ids' | 'type'>;

  abstract send(): Promise<void>;

  getBaseSlipParams() {
    return {
      chatId: this.props.chatId,
    };
  }

  getSkipParams(): SkipParams {
    return {
      expireInSec: REDIS_DAY_IN_SEC * 2,
      ...this.getAdditionalSkipParams(),
      ...this.getBaseSlipParams(),
    };
  }

  async setSkip() {
    await this.skipper.setSkipCache(this.getSkipParams());
  }

  async isSkip() {
    return this.isExecuted || (await this.skipper.isSkip(this.getSkipParams()));
  }

  async execute() {
    if (await this.isSkip()) {
      return;
    }

    await this.send();
    await this.setSkip();

    this.isExecuted = true;
  }
}
