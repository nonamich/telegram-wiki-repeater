import { getDBClient, getInitDB } from '@repo/db';

export type DB = ReturnType<typeof getInitDB>;
export type DBClient = ReturnType<typeof getDBClient>;
