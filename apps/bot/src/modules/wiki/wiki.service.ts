import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AxiosError } from 'axios';

import { Utils } from '@repo/shared';

import { CacheService } from '../cache/cache.service';
import {
  FeaturedResponse,
  FeaturedRequest,
} from './interfaces/featured.interface';

@Injectable()
export class WikiService {
  constructor(
    private readonly cacheService: CacheService,
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
    const {
      defaults: { baseURL },
    } = this.http.axiosRef;
    const cacheKey = `wikiApi:get:${baseURL}${url}`;
    const cache = await this.cacheService.get<T>(cacheKey);

    if (cache) return cache;

    try {
      const { data, status } = await this.http.axiosRef.get<T>(url);

      if (status === 200) {
        await this.cacheService.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 504) {
        await Utils.sleep(5000);

        return this.request(url);
      }

      throw error;
    }
  }
}
