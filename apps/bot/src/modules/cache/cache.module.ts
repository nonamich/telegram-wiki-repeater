import { DynamicModule, Module } from '@nestjs/common';

import { RedisClientOptions, createClient } from '@redis/client';

import { REDIS_INSTANCE_TOKEN, CACHE_MODULE_OPTIONS } from './cache.constants';
import { CacheService } from './cache.service';
import { RedisType } from './cache.type';
import { CacheOptionsAsync } from './interfaces/cache-module.interface';

let redis: RedisType;

@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {
  static async connect(options: RedisClientOptions) {
    if (!redis) {
      redis = await createClient(options).connect();
    }

    return redis;
  }

  static forRoot(options: RedisClientOptions): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: REDIS_INSTANCE_TOKEN,
          useFactory: () => CacheModule.connect(options),
        },
      ],
      exports: [REDIS_INSTANCE_TOKEN],
    };
  }

  static forRootAsync(options: CacheOptionsAsync): DynamicModule {
    return {
      module: CacheModule,
      imports: options.imports,
      global: options.isGlobal,
      exports: [REDIS_INSTANCE_TOKEN],
      providers: [
        {
          provide: CACHE_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: REDIS_INSTANCE_TOKEN,
          useFactory: CacheModule.connect,
          inject: [CACHE_MODULE_OPTIONS],
        },
      ],
    };
  }
}
