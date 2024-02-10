import { DynamicModule, Global, Module, OnModuleDestroy } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { getInitDB, getDBClient } from '@repo/db';

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
          useValue: getDBClient(),
        },
        {
          inject: [DB_CLIENT_PROVIDER],
          provide: DB_PROVIDER,
          useFactory(dbClient: DBClient) {
            return getInitDB(dbClient);
          },
        },
      ],
    };
  }

  onModuleDestroy() {
    const dbClient = this.moduleRef.get<DBClient>(DB_CLIENT_PROVIDER);

    return dbClient.end();
  }
}
