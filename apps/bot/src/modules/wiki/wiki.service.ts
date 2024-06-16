import { setTimeout as sleep } from 'node:timers/promises';
import zlib from 'zlib';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AxiosError } from 'axios';
import dayjs from 'dayjs';

import { Utils } from '@repo/shared';

import { HOUR_IN_SEC } from '../redis/redis.constants';
import { RedisService } from '../redis/redis.service';
import {
  OrderOfArticles,
  WikiLanguage,
  WikiOnThisDay,
  WikiRequest,
} from './types';
import { FeaturedResponse, FeaturedRequest } from './types/featured';
import { WIKI_CACHE_ENCODING, WIKI_RETRY_MS } from './wiki.constants';

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

  getUrlFeaturedContent({ lang, year, month, day }: FeaturedRequest) {
    return `/${lang}/featured/${year}/${Utils.zeroPad(month)}/${Utils.zeroPad(day)}`;
  }

  async getFeaturedContent(params: FeaturedRequest) {
    const response = await this.request<FeaturedResponse>({
      url: this.getUrlFeaturedContent(params),
    });

    if (response.onthisday) {
      for (const onthisday of response.onthisday) {
        this.deleteUselessPage(onthisday);
      }
    }

    return { ...response, mostread: response?.mostread?.articles };
  }

  private getCacheKey(url: string) {
    return `wiki:${url}`;
  }

  private async getCacheResponse<T>(url: string) {
    const cacheKey = this.getCacheKey(url);
    const cacheAsBase64 = await this.redis.get(cacheKey);

    if (!cacheAsBase64) {
      return null;
    }

    const buffer = Buffer.from(cacheAsBase64, WIKI_CACHE_ENCODING);
    const json = zlib.brotliDecompressSync(buffer).toString('utf8');

    return JSON.parse(json) as T;
  }

  deleteUselessPage({ pages, year }: WikiOnThisDay) {
    const findIndex = pages.findIndex(({ titles: { normalized: title } }) => {
      return new RegExp(`^${year} `).test(title);
    });

    if (findIndex === -1) {
      return;
    }

    pages.splice(findIndex, 1);
  }

  private async setToCache<T extends object>(
    data: T,
    { url, expires = HOUR_IN_SEC * 5 }: WikiRequest,
  ) {
    const cacheKey = this.getCacheKey(url);
    const input = JSON.stringify(data);
    const cache = zlib.brotliCompressSync(input).toString(WIKI_CACHE_ENCODING);

    await this.redis.setex(cacheKey, expires, cache);
  }

  private async request<T extends object>({
    url,
    expires,
  }: WikiRequest): Promise<T> {
    const cache = await this.getCacheResponse<T>(url);

    if (cache) {
      return cache;
    }

    try {
      const { data, status } = await this.http.axiosRef.get<T>(url);

      if (status === 200) {
        await this.setToCache(data, {
          url,
          expires,
        });
      }

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        await sleep(WIKI_RETRY_MS);

        return await this.request<T>({
          url,
          expires,
        });
      }

      throw error;
    }
  }

  async getFeaturedContentAsArray(lang: WikiLanguage) {
    const response = await this.getFeaturedContent(
      this.getFeaturedRequestParams(lang),
    );
    const { image, mostread, news, onthisday, tfa } = response;
    const entityOfData: OrderOfArticles = [];
    const entityOfDataMixed: OrderOfArticles = [];

    if (image) {
      entityOfData.push(['tfi', image]);
    }

    if (tfa) {
      entityOfData.push(['tfa', tfa]);
    }

    if (mostread) {
      for (const item of mostread) {
        entityOfDataMixed.push(['mostread', item]);
      }
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
