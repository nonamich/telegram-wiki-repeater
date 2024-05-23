import { Injectable } from '@nestjs/common';

import { RedisService } from '~/modules/redis/redis.service';

@Injectable()
export class TelegramPlanner {
  constructor(private readonly redis: RedisService) {}

  get hour() {
    return new Date().getHours();
  }

  isTimeFeaturedImage() {
    return this.hour >= 12;
  }

  isTimeFeaturedArticle() {
    return this.hour >= 15;
  }
}
