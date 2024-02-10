import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { Redis, RedisOptions } from 'ioredis';

import { REDIS_OPTIONS } from './redis.constants';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Inject(REDIS_OPTIONS) options: RedisOptions) {
    super({
      lazyConnect: true,
      ...options,
    });
  }

  onModuleInit() {
    return this.connect();
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
