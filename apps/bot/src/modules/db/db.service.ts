import { Injectable } from '@nestjs/common';

import { drizzle } from '@repo/db';

import { DB } from './db.types';
import { InjectDB } from './decorators/inject-db.decorator';

@Injectable()
export class DBService {
  constructor(@InjectDB() private readonly db: DB) {}

  async getDevChannels() {
    const channels = await this.db.query.channels.findMany({
      columns: {
        id: true,
        lang: true,
      },
      where: (channel) => drizzle.eq(channel.isDev, true),
    });

    return channels;
  }

  async getChannels() {
    const channels = await this.db.query.channels.findMany({
      columns: {
        id: true,
        lang: true,
      },
      where: (channel) => drizzle.eq(channel.isDev, false),
    });

    return channels;
  }

  async getChannelById(id: string) {
    const channels = await this.db.query.channels.findFirst({
      columns: {
        id: true,
        lang: true,
      },
      where: (channel) => drizzle.eq(channel.id, id),
    });

    return channels;
  }
}
