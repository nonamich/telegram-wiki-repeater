import { DynamicModule, Module } from '@nestjs/common';

import { DBOptionsAsync } from './interfaces/redis-module.interface';
import { REDIS_OPTIONS } from './redis.constants';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static forRootAsync(options: DBOptionsAsync): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      global: options.global,
      providers: [
        {
          provide: REDIS_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
    };
  }
}
