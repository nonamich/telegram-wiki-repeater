import { RedisClientType } from '@redis/client';
import {
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client/dist/lib/commands';

export type RedisType = RedisClientType<
  RedisModules,
  RedisFunctions,
  RedisScripts
>;
