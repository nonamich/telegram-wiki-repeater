import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  token: string;

  constructor(readonly config: ConfigService) {
    this.token = this.config.getOrThrow('CLOUDIMAGE_TOKEN');
  }

  getProxyURL(url: string) {
    return `https://${this.token}.cloudimg.io/v7/${url}?org_if_sml=1&func=bound`;
  }

  getResizedProxyURL(url: string, width: number) {
    const urlObj = new URL(this.getProxyURL(url));

    const height = width * 1.5;

    urlObj.searchParams.append('w', width.toString());
    urlObj.searchParams.append('h', height.toString());

    return urlObj.toString();
  }
}
