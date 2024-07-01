import path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  token: string;

  constructor(readonly config: ConfigService) {
    this.token = this.config.getOrThrow('CLOUDIMAGE_TOKEN');
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

  getResizedProxyURL(url: string, width: number) {
    const urlObj = new URL(this.getProxyURL(url));

    const height = width * 1.5;

    urlObj.searchParams.append('w', width.toString());
    urlObj.searchParams.append('h', height.toString());

    return urlObj.toString();
  }
}
