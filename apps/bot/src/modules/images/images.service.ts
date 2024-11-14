import path from 'node:path';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CacheableAsync } from '@repo/shared';

import { ImageExceptionForbiddenResize } from './exceptions/image.exception.resize-forbidden';
import { IMAGE_MAX_SIZE_TO_RESIZE_IN_BYTES } from './images.constants';

@Injectable()
export class ImagesService {
  token: string;

  constructor(
    readonly http: HttpService,
    readonly config: ConfigService,
  ) {
    this.token = this.config.getOrThrow('CLOUD_IMAGE_ID');
  }

  @CacheableAsync()
  async getContentLength(url: string) {
    const { headers } = await this.http.axiosRef.head(url);

    return +headers['content-length'];
  }

  removeSchemaProtocol(string: string) {
    return string.replace(/^https?:\/\//, '');
  }

  getProxyURL(url: string) {
    const { ext } = path.parse(url);
    const schemalessURL = this.removeSchemaProtocol(url);
    const obj = new URL(
      `https://${this.token}.cloudimg.io/v7/${schemalessURL}`,
    );

    obj.searchParams.append('org_if_sml', '1'); // https://docs.cloudimage.io/transformations/image-operations/prevent-enlargement
    obj.searchParams.append('func', 'bound'); // https://docs.cloudimage.io/transformations/image-operations/bound#examples

    if (ext === '.svg') {
      obj.searchParams.append('force_format', 'jpeg');
      obj.searchParams.append('q', '85');
    }

    return obj.toString();
  }

  async getResizeURL(url: string, width: number) {
    const contentLength = await this.getContentLength(url);

    if (contentLength >= IMAGE_MAX_SIZE_TO_RESIZE_IN_BYTES) {
      throw new ImageExceptionForbiddenResize();
    }

    const urlObj = new URL(this.getProxyURL(url));
    const height = width * 1.5;

    urlObj.searchParams.append('w', width.toString());
    urlObj.searchParams.append('h', height.toString());

    return urlObj.toString();
  }
}
