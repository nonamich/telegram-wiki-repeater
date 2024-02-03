import { Module, OnModuleDestroy } from '@nestjs/common';

import { dbDisconnect } from '@repo/db';

@Module({})
export class DatabaseModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await dbDisconnect();
  }
}
