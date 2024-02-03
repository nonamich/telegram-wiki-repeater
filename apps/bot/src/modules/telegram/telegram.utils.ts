import { RedisType } from '../cache/cache.type';

export const getSessionStore = (redis: RedisType) => {
  const prefix = 'telegraf:';

  return {
    async get(key) {
      const value = await redis.get(`${prefix}${key}`);

      return value ? JSON.parse(value) : undefined;
    },

    set(key: string, data: object) {
      return redis.set(`${prefix}${key}`, JSON.stringify(data));
    },

    delete(key: string) {
      return redis.del(`${prefix}${key}`);
    },
  };
};
