import './bootstrap';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as Schemas from './schemas';

const client = postgres({
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DATABASE,
  ssl: 'require',
});

export const db = drizzle(client, { schema: Schemas });

export const dbDisconnect = () => client.end();

export * as drizzle from 'drizzle-orm';
export { Schemas };
