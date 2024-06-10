import { pgTable, varchar, boolean } from 'drizzle-orm/pg-core';

import { SUPPORT_LANGUAGES } from '@repo/shared';

export const channels = pgTable('channels', {
  id: varchar('id').primaryKey(),
  lang: varchar('lang', { enum: SUPPORT_LANGUAGES }).unique().notNull(),
  isDev: boolean('isDev').notNull().default(true),
});
