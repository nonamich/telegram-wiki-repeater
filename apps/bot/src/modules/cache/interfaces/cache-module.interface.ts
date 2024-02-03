import { ModuleMetadata } from '@nestjs/common';

import { RedisClientOptions } from '@redis/client';

export interface CacheOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useFactory: (
    ...args: any[]
  ) => Promise<RedisClientOptions> | RedisClientOptions;
  inject?: any[];
}
