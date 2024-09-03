import { pgTable, varchar, boolean } from 'drizzle-orm/pg-core';

import { SUPPORTED_LANGUAGES } from '@repo/shared';

export const channels = pgTable('channels', {
  id: varchar('id').primaryKey(),
  lang: varchar('lang', { enum: SUPPORTED_LANGUAGES }).notNull(),
  isDev: boolean('isDev').notNull().default(true),
});
