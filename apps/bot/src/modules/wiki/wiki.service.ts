import { setTimeout as sleep } from 'node:timers/promises';
import zlib from 'node:zlib';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';

import { Utils } from '@repo/shared';

import { REDIS_HOUR_IN_SEC } from '~/modules/redis/redis.constants';
import { RedisService } from '~/modules/redis/redis.service';

import {
  OnThisDayRequest,
  OnThisDayResponse,
  OrderOfArticles,
  WikiLanguage,
  WikiOnThisDay,
  WikiRequest,
  FeaturedResponse,
  FeaturedRequest,
} from './types';
import {
  WIKI_CACHE_ENCODING,
  WIKI_MAX_PAGE_ON_THIS_DAY,
  WIKI_RETRY_MS,
} from './wiki.constants';

@Injectable()
export class WikiService {
  constructor(
    private readonly redis: RedisService,
    private readonly http: HttpService,
  ) {}

  getFeaturedRequestParams(lang: WikiLanguage) {
    const date = dayjs();
    const params: FeaturedRequest = {
      lang,
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    };

    return params;
  }

  getURLOnThisDay({ lang, month, day }: OnThisDayRequest) {
    return `/${lang}/onthisday/events/${Utils.zeroPad(month)}/${Utils.zeroPad(day)}`;
  }

  getURLFeaturedContent({ lang, year, month, day }: FeaturedRequest) {
    return `/${lang}/featured/${year}/${Utils.zeroPad(month)}/${Utils.zeroPad(day)}`;
  }

  async getEvents(params: OnThisDayRequest) {
    const response = await this.request<OnThisDayResponse>({
      url: this.getURLOnThisDay(params),
    });

    return response.events;
  }

  async getFeaturedContent(params: FeaturedRequest) {
    return await this.request<FeaturedResponse>({
      url: this.getURLFeaturedContent(params),
    });
  }

  deleteUselessOnthisday(events: WikiOnThisDay[]) {
    const ids = new Set<number>();

    for (const event of events) {
      for (const [index, { pageid }] of event.pages.entries()) {
        if (ids.has(pageid)) {
          events.slice(index, 1);

          continue;
        }

        ids.add(pageid);
      }
    }
  }

  async getContent(params: FeaturedRequest) {
    const content = await this.getFeaturedContent(params);
    const events = await this.getEvents(params);

    if (!content.onthisday) {
      content.onthisday = [];
    }

    content.onthisday.push(...events);

    this.deleteUselessPage(content.onthisday);
    this.deleteUselessOnthisday(content.onthisday);

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

    const buffer = Buffer.from(base64Cache, WIKI_CACHE_ENCODING);
    const json = zlib.brotliDecompressSync(buffer).toString('utf8');

    return JSON.parse(json) as T;
  }

  deleteUselessPage(onthisday: WikiOnThisDay[]) {
    for (const { pages, year } of onthisday) {
      const yearPageIndex = pages.findIndex(
        ({ titles: { normalized: title } }) => {
          return new RegExp(`^${year} `).test(title);
        },
      );

      if (yearPageIndex !== -1) {
        pages.splice(yearPageIndex, 1);
      }

      pages.splice(WIKI_MAX_PAGE_ON_THIS_DAY);
    }
  }

  private async setToCache<T extends object>(
    data: T,
    { url, expires = REDIS_HOUR_IN_SEC * 5 }: WikiRequest,
  ) {
    const cacheKey = this.getCacheKey(url);
    const input = JSON.stringify(data);
    const cache = zlib.brotliCompressSync(input).toString(WIKI_CACHE_ENCODING);

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
    const { image, news, onthisday, tfa } = await this.getContent(
      this.getFeaturedRequestParams(lang),
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

    if (news) {
      for (const item of news) {
        entityOfDataMixed.push(['news', item]);
      }
    }

    return [...entityOfData, ...entityOfDataMixed];
  }
}
