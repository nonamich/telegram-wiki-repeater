import { ModuleMetadata } from '@nestjs/common';

import { RedisOptions } from 'ioredis';

export interface DBOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
  inject?: any[];
}
