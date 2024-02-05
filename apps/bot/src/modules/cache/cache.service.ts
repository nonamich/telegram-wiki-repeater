import { Inject, Injectable } from '@nestjs/common';

import { DAY_IN_SEC, REDIS_INSTANCE_TOKEN } from './cache.constants';
import { RedisType } from './cache.type';

@Injectable()
export class CacheService {
  constructor(
    @Inject(REDIS_INSTANCE_TOKEN)
    public readonly redis: RedisType,
  ) {}

  async get<T>(cacheKey: string) {
    const cache = await this.redis.get(cacheKey);

    if (cache) {
      try {
        return JSON.parse(cache) as T;
      } catch {}
    }
  }

  async set(cacheKey: string, data: object, EX = DAY_IN_SEC) {
    await this.redis.set(cacheKey, JSON.stringify(data), {
      EX,
    });
  }
}
