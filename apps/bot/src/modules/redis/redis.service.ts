import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

import { Redis, RedisOptions } from 'ioredis';

import { REDIS_OPTIONS } from './redis.constants';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(@Inject(REDIS_OPTIONS) options: RedisOptions) {
    super({
      lazyConnect: true,
      ...options,
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onApplicationShutdown() {
    await this.disconnect();
  }
}
