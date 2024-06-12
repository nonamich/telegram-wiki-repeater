import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { Schemas } from '.';

export const initDBClient = () => {
  return postgres(process.env.DATABASE_URL!);
};

export const initORM = (client: postgres.Sql) => {
  return drizzle(client, { schema: Schemas });
};
