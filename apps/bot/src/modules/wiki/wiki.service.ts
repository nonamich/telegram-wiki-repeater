import { setTimeout as sleep } from 'node:timers/promises';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

import { REDIS_HOUR_IN_SEC } from '~/modules/redis/redis.constants';
import { RedisService } from '~/modules/redis/redis.service';

import {
  OnThisDayRequest,
  OnThisDayResponse,
  OrderOfArticles,
  WikiLanguage,
  WikiRequest,
  FeaturedResponse,
  FeaturedRequest,
} from './types';
import { WIKI_RETRY_MS } from './wiki.constants';
import { WikiUtils } from './wiki.utils';
import { WikiValidator } from './wiki.validator';

@Injectable()
export class WikiService {
  constructor(
    private readonly redis: RedisService,
    private readonly http: HttpService,
    private readonly validator: WikiValidator,
    private readonly utils: WikiUtils,
  ) {}

  getTodayFeaturedRequestParams(lang: WikiLanguage) {
    const date = dayjs();
    const params: FeaturedRequest = {
      lang,
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    };

    return params;
  }

  getURLOnThisDay(params: OnThisDayRequest) {
    const { lang, month, day } = this.utils.prepareParams(params);

    return `/${lang}/onthisday/events/${month}/${day}`;
  }

  getURLFeaturedContent(params: FeaturedRequest) {
    const { lang, year, month, day } = this.utils.prepareParams(params);

    return `/${lang}/featured/${year}/${month}/${day}`;
  }

  async getEvents(params: OnThisDayRequest) {
    const { events } = await this.request<OnThisDayResponse>({
      url: this.getURLOnThisDay(params),
    });

    return events;
  }

  async getFeaturedContent(params: FeaturedRequest) {
    return await this.request<FeaturedResponse>({
      url: this.getURLFeaturedContent(params),
    });
  }

  async getContent(params: FeaturedRequest) {
    const content = await this.getFeaturedContent(params);
    const events = await this.getEvents(params);

    if (!content.onthisday) {
      content.onthisday = [];
    }

    content.onthisday.push(...events);

    content.onthisday = this.validator.deleteUselessPage(content.onthisday);

    content.onthisday = this.validator.deleteUselessOnthisday(
      content.onthisday,
    );

    return content;
  }

  private getCacheKey(url: string) {
    return `wiki:${url}`;
  }

  private async getCacheResponse<T>(url: string) {
    const cacheKey = this.getCacheKey(url);
    const base64Cache = await this.redis.get(cacheKey);

    if (!base64Cache) {
      return null;
    }

    return this.utils.cacheDecompressSync<T>(base64Cache);
  }

  private async setToCache<T extends object>(
    data: T,
    { url, expires = REDIS_HOUR_IN_SEC * 5 }: WikiRequest,
  ) {
    const cacheKey = this.getCacheKey(url);
    const cache = this.utils.cacheCompressSync(data);

    await this.redis.setex(cacheKey, expires, cache);
  }

  private async request<T extends object>(params: WikiRequest): Promise<T> {
    const { url } = params;
    const cache = await this.getCacheResponse<T>(url);

    if (cache) {
      return cache;
    }

    try {
      const { data, status } = await this.http.axiosRef.get<T>(url);

      if (status === 200) {
        await this.setToCache(data, params);
      }

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        await sleep(WIKI_RETRY_MS);

        return await this.request(params);
      }

      throw error;
    }
  }

  async getFeaturedContentAsArray(lang: WikiLanguage) {
    const { image, onthisday, tfa } = await this.getContent(
      this.getTodayFeaturedRequestParams(lang),
    );
    const entityOfData: OrderOfArticles = [];
    const entityOfDataMixed: OrderOfArticles = [];

    if (image) {
      entityOfData.push(['tfi', image]);
    }

    if (tfa) {
      entityOfData.push(['tfa', tfa]);
    }

    if (onthisday) {
      for (const item of onthisday) {
        entityOfDataMixed.push(['onthisday', item]);
      }
    }

    return [...entityOfData, ...entityOfDataMixed];
  }
}
