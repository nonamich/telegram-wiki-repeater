import { initDBClient, initORM } from '@repo/db';

export type DB = ReturnType<typeof initORM>;
export type DBClient = ReturnType<typeof initDBClient>;
