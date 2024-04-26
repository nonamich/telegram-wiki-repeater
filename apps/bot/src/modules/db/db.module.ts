import { DynamicModule, Global, Module, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { initORM, initDBClient } from '@repo/db';

import { DB_PROVIDER, DB_CLIENT_PROVIDER } from './db.constants';
import { DBClient } from './db.types';

@Global()
@Module({})
export class DBModule implements OnModuleDestroy {
  constructor(private moduleRef: ModuleRef) {}

  static forRoot(): DynamicModule {
    return {
      exports: [DB_PROVIDER],
      module: DBModule,
      providers: [
        {
          provide: DB_CLIENT_PROVIDER,
          useValue: initDBClient(),
        },
        {
          inject: [DB_CLIENT_PROVIDER],
          provide: DB_PROVIDER,
          useFactory(dbClient: DBClient) {
            return initORM(dbClient);
          },
        },
      ],
    };
  }

  async onModuleDestroy() {
    const db = this.moduleRef.get<DBClient>(DB_CLIENT_PROVIDER);

    await db.end();
  }
}
