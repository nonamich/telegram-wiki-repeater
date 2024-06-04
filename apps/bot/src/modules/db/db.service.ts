import { Injectable } from '@nestjs/common';

import { DB } from './db.types';
import { InjectDB } from './decorators/inject-db.decorator';

@Injectable()
export class DBService {
  constructor(@InjectDB() private readonly db: DB) {}

  async getChannels() {
    const channels = await this.db.query.channels.findMany({
      columns: {
        id: true,
        lang: true,
      },
    });

    return channels;
  }
}
