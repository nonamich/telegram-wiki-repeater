import { setTimeout as sleep } from 'node:timers/promises';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AxiosError } from 'axios';

import { DAY_IN_HOUR } from '../redis/redis.constants';
import { RedisService } from '../redis/redis.service';
import {
  FeaturedResponse,
  FeaturedRequest,
} from './interfaces/featured.interface';
import { WIKI_BASE_URL } from './wiki.constants';

@Injectable()
export class WikiService {
  constructor(
    private readonly redis: RedisService,
    private readonly http: HttpService,
  ) {}

  getFeaturedContent(args: FeaturedRequest) {
    return this.request<FeaturedResponse>(this.getUrlFeatured(args));
  }

  private getUrlFeatured({ lang, year, month, day }: FeaturedRequest) {
    return `/${lang}/featured/${year}/${this.getZeroPadded(month)}/${this.getZeroPadded(day)}`;
  }

  private getZeroPadded(num: number) {
    return num.toString().padStart(2, '0');
  }

  private async request<T extends object>(url: string): Promise<T> {
    const cacheKey = `wiki:api:get:${new URL(WIKI_BASE_URL).host}${url}`;
    const cache = await this.redis.get(cacheKey);

    if (cache) {
      return JSON.parse(cache) as T;
    }

    try {
      const { data, status } = await this.http.axiosRef.get<T>(url);

      if (status === 200) {
        await this.redis.setex(cacheKey, DAY_IN_HOUR * 2, JSON.stringify(data));
      }

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 504) {
        await sleep(10000);

        return this.request(url);
      }

      throw error;
    }
  }
}
