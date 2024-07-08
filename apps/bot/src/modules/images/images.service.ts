import path from 'node:path';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImageExceptionResizeForbidden } from './exceptions/image.exception.resize-forbidden';
import { IMAGE_MAX_SIZE_TO_RESIZE } from './images.constants';

const contentLengthCache = new Map<string, number>();

@Injectable()
export class ImagesService {
  token: string;

  constructor(
    readonly http: HttpService,
    readonly config: ConfigService,
  ) {
    this.token = this.config.getOrThrow('CLOUDIMAGE_TOKEN');
  }

  async getContentLength(url: string) {
    let value = contentLengthCache.get(url);

    if (!value) {
      const { headers } = await this.http.axiosRef.head(url);
      const contentLength = Number(headers['content-length']);

      value = contentLength;

      contentLengthCache.set(url, value);
    }

    return value;
  }

  getProxyURL(url: string) {
    const { ext } = path.parse(url);
    const obj = new URL(`https://${this.token}.cloudimg.io/v7/${url}`);

    obj.searchParams.append('org_if_sml', '1');
    obj.searchParams.append('func', 'bound');

    if (ext === '.svg') {
      obj.searchParams.append('force_format', 'jpeg');
      obj.searchParams.append('q', '85');
    }

    return obj.toString();
  }

  async getResizedProxyURL(url: string, width: number) {
    const contentLength = await this.getContentLength(url);

    if (contentLength >= IMAGE_MAX_SIZE_TO_RESIZE) {
      throw new ImageExceptionResizeForbidden();
    }

    const urlObj = new URL(this.getProxyURL(url));

    const height = width * 1.5;

    urlObj.searchParams.append('w', width.toString());
    urlObj.searchParams.append('h', height.toString());

    return urlObj.toString();
  }
}
