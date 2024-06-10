import { DAY_IN_SEC } from '~/modules/redis/redis.constants';

import { TelegramSender } from '../telegram.sender';
import { ChatId, SkipParams } from '../telegram.types';
import { TelegramSkipper } from '../with-i18n-context/telegram.skipper';

export abstract class BaseDispatcherStrategy<T extends object = object> {
  public isSended = false;

  constructor(
    readonly skipper: TelegramSkipper,
    readonly sender: TelegramSender,
    readonly chatId: ChatId,
    readonly data: T,
  ) {}

  abstract getSkipParams(): Pick<SkipParams, 'ids' | 'type'>;

  abstract send(): Promise<void>;

  getBaseSkipParams(): SkipParams {
    return {
      ...this.getSkipParams(),
      chatId: this.chatId,
      expireInSec: DAY_IN_SEC * 2,
    };
  }

  async setSkip() {
    await this.skipper.setSkipCache(this.getBaseSkipParams());
  }

  async isSkip() {
    return await this.skipper.isSkip(this.getBaseSkipParams());
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
