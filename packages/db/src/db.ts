import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { Schemas } from '.';

export const initDBClient = () => {
  return postgres({
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    ssl: 'require',
  });
};

export const initORM = (client: postgres.Sql) => {
  return drizzle(client, { schema: Schemas });
};
