import { Injectable } from '@nestjs/common';

import { DB } from './db.types';
import { InjectDB } from './decorators/inject-db.decorator';

@Injectable()
export class DBService {
  constructor(@InjectDB() private readonly db: DB) {}

  async getAllChannels() {
    const channels = await this.db.query.channels.findMany({
      columns: {
        id: true,
        lang: true,
        isDev: true,
      },
    });

    return channels;
  }

  async getProdChannels() {
    const channels = await this.db.query.channels.findMany({
      columns: {
        id: true,
        lang: true,
      },
      where: (channel, { eq }) => eq(channel.isDev, false),
    });

    return channels;
  }

  async getChannelById(id: string) {
    const channels = await this.db.query.channels.findFirst({
      columns: {
        id: true,
        lang: true,
      },
      where: (channel, { eq }) => eq(channel.id, id),
    });

    return channels;
  }
}
