import zlib from 'node:zlib';

import { Injectable } from '@nestjs/common';

import { Utils, NumberPropertiesToString } from '@repo/shared';

import { WIKI_CACHE_ENCODING } from './wiki.constants';

@Injectable()
export class WikiUtils {
  prepareParams<T extends object>(params: T): NumberPropertiesToString<T> {
    const entires = Object.entries(params).map(([name, value]) => {
      if (typeof value === 'number') {
        value = Utils.zeroPad(value);
      }

      return [name, value];
    });

    return Object.fromEntries(entires);
  }

  cacheDecompressSync<T>(cache: string) {
    const buffer = Buffer.from(cache, WIKI_CACHE_ENCODING);
    const json = zlib.brotliDecompressSync(buffer).toString('utf8');

    return JSON.parse(json) as T;
  }

  cacheCompressSync<T extends object>(data: T) {
    const input = JSON.stringify(data);

    return zlib.brotliCompressSync(input).toString(WIKI_CACHE_ENCODING);
  }
}
