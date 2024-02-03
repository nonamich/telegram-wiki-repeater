import { createClient } from '@redis/client';

export type RedisType = ReturnType<typeof createClient>;
