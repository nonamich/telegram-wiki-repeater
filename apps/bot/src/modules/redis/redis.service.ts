import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';

import { Redis, RedisOptions } from 'ioredis';

import { REDIS_OPTIONS } from './redis.constants';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Inject(REDIS_OPTIONS) { path, ...options }: RedisOptions) {
    if (path) {
      super(path, {
        lazyConnect: true,
        ...options,
      });
    } else {
      super({
        lazyConnect: true,
        ...options,
      });
    }
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
