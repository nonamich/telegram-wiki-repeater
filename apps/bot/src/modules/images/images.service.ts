import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  token: string;

  constructor(readonly config: ConfigService) {
    this.token = this.config.getOrThrow('CLOUDIMAGE_TOKEN');
  }

  getProxyURL(url: string) {
    return `https://${this.token}.cloudimg.io/v7/${url}`;
  }

  resize(url: string, size: number) {
    const urlObj = new URL(this.getProxyURL(url));

    urlObj.searchParams.append('w', size.toString());

    return urlObj.toString();
  }
}
