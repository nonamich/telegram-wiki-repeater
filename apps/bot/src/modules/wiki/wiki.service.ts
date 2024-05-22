import { setTimeout as sleep } from 'node:timers/promises';
import zlib from 'zlib';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AxiosError } from 'axios';

import { Utils } from '@repo/shared';

import { DAY_IN_SEC, HOUR_IN_SEC } from '../redis/redis.constants';
import { RedisService } from '../redis/redis.service';
import {
  OnThisDayRequest,
  OnThisDayResponse,
  WikiLanguage,
  WikiRequest,
} from './interfaces';
import {
  FeaturedResponse,
  FeaturedRequest,
} from './interfaces/featured.interface';
import { WIKI_CACHE_ENCODING, WIKI_RETRY_MS } from './wiki.constants';

@Injectable()
export class WikiService {
  constructor(
    private readonly redis: RedisService,
    private readonly http: HttpService,
  ) {}

  getOnThisDay({ lang, month, day }: OnThisDayRequest) {
    return this.request<OnThisDayResponse>({
      url: `/${lang}/onthisday/all/${Utils.zeroPad(month)}/${Utils.zeroPad(day)}`,
      expires: DAY_IN_SEC,
    });
  }

  getFeaturedRequestParams(lang: WikiLanguage) {
    const date = new Date();
    const params: FeaturedRequest = {
      lang,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
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
    const { holidays: _, ...onthisday } = await this.getOnThisDay(params);

    return response;
  }

  private getCacheKey(url: string) {
    return `wiki:${url}`;
  }

  private async getCacheResponse<T>(url: string) {
    const cacheKey = this.getCacheKey(url);
    const cacheAsBase64 = await this.redis.get(cacheKey);

    if (cacheAsBase64) {
      const buffer = Buffer.from(cacheAsBase64, WIKI_CACHE_ENCODING);
      const json = zlib.brotliDecompressSync(buffer).toString('utf8');

      return JSON.parse(json) as T;
    }

    return null;
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

        return this.request<T>({
          url,
          expires,
        });
      }

      throw error;
    }
  }
}
