import { DynamicModule } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface DBOptionsAsync
  extends Pick<DynamicModule, 'imports' | 'global'> {
  useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
  inject?: any[];
}
