import { Injectable } from '@nestjs/common';

import { RedisService } from '~/modules/redis/redis.service';

@Injectable()
export class TelegramSessionStore {
  readonly prefix = 'telegraf';

  constructor(private readonly redis: RedisService) {}

  geKeyWithPrefix(key: string) {
    return `${this.prefix}:${key}`;
  }

  async get(key: string) {
    const value = await this.redis.get(this.geKeyWithPrefix(key));

    return value ? JSON.parse(value) : undefined;
  }

  set(key: string, data: object) {
    return this.redis.set(this.geKeyWithPrefix(key), JSON.stringify(data));
  }

  delete(key: string) {
    return this.redis.del(this.geKeyWithPrefix(key));
  }
}
