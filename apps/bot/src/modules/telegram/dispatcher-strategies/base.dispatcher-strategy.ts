import { DAY_IN_SEC } from '~/modules/redis/redis.constants';

import { TelegramSender } from '../telegram.sender';
import { TelegramSkipper } from '../telegram.skipper';
import { ChatId, SkipParams } from '../telegram.types';

type Props<T> = {
  chatId: ChatId;
  data: T;
  lang: string;
};

export abstract class BaseDispatcherStrategy<T extends object = object> {
  public isSended = false;

  constructor(
    readonly skipper: TelegramSkipper,
    readonly sender: TelegramSender,
    readonly props: Props<T>,
  ) {}

  abstract getAdditionalSkipParams(): Pick<SkipParams, 'ids' | 'type'>;

  abstract send(): Promise<void>;

  getBaseSlipParams() {
    return {
      lang: this.props.lang,
      chatId: this.props.chatId,
    };
  }

  getSkipParams(): SkipParams {
    return {
      ...this.getAdditionalSkipParams(),
      ...this.getBaseSlipParams(),
      expireInSec: DAY_IN_SEC * 2,
    };
  }

  async setSkip() {
    await this.skipper.setSkipCache(this.getSkipParams());
  }

  async isSkip() {
    return await this.skipper.isSkip(this.getSkipParams());
  }

  async execute() {
    if (await this.isSkip()) {
      return;
    }

    await this.send();
    await this.setSkip();

    this.isSended = true;
  }
}
