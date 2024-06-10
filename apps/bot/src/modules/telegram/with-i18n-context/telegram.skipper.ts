import { Injectable } from '@nestjs/common';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { DAY_IN_SEC } from '~/modules/redis/redis.constants';
import { RedisService } from '~/modules/redis/redis.service';

import { SkipParams } from '../telegram.types';

@Injectable()
export class TelegramSkipper {
  constructor(readonly redis: RedisService) {}

  public async isSkip({ expireInSec = DAY_IN_SEC * 3, ...args }: SkipParams) {
    if (!expireInSec) {
      return false;
    }

    const key = this.getSkipCacheKey(args);
    const value = await this.redis.get(key);

    return Boolean(value);
  }

  private getSkipCacheKey({ ids, type }: SkipParams) {
    const { language } = useI18n();

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    return `skip:${language}:${type}:${ids.join(',')}`;
  }

  public async setSkipCache({ expireInSec = DAY_IN_SEC, ...args }: SkipParams) {
    const key = this.getSkipCacheKey(args);

    if (!expireInSec) {
      return false;
    }

    await this.redis.setex(key, expireInSec, 'true');
  }
}
