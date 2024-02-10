import { setTimeout as sleep } from 'node:timers/promises';
import zlib from 'zlib';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AxiosError } from 'axios';

import { Utils } from '@repo/shared';

import { DAY_IN_SEC, HOUR_IN_SEC } from '../redis/redis.constants';
import { RedisService } from '../redis/redis.service';
import { OnThisDayRequest, OnThisDayResponse, WikiRequest } from './interfaces';
import {
  FeaturedResponse,
  FeaturedRequest,
} from './interfaces/featured.interface';
import { WIKI_CACHE_ENCODING } from './wiki.constants';

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

  async getFeatured({ lang, year, month, day }: FeaturedRequest) {
    const response = await this.request<FeaturedResponse>({
      url: `/${lang}/featured/${year}/${Utils.zeroPad(month)}/${Utils.zeroPad(day)}`,
    });

    if (!response.onthisday || response.onthisday.length < 30) {
      const { events, deaths, holidays } = await this.getOnThisDay({
        lang,
        month,
        day,
      });

      response.onthisday = [response.onthisday, events, deaths, holidays]
        .filter(Utils.truthy)
        .flat();
    }

    return response;
  }

  private async request<T extends object>({
    url,
    expires = HOUR_IN_SEC * 5,
    filter,
  }: WikiRequest<T>): Promise<T> {
    const cacheKey = `wiki:${url}`;
    const cache = await this.redis.get(cacheKey);

    if (cache) {
      const buffer = Buffer.from(cache, WIKI_CACHE_ENCODING);
      const json = zlib.brotliDecompressSync(buffer).toString('utf8');

      return JSON.parse(json) as T;
    }

    try {
      const { data, status } = await this.http.axiosRef.get<T>(url);

      if (status === 200) {
        const input = JSON.stringify(data);
        const buffer = zlib.brotliCompressSync(input);
        const base64 = buffer.toString(WIKI_CACHE_ENCODING);

        await this.redis.setex(cacheKey, expires, base64);
      }

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        await sleep(10000);

        return this.request<T>({
          url,
          expires,
          filter,
        });
      }

      throw error;
    }
  }
}
