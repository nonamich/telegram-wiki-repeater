import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { SUPPORT_LANGUAGES } from '@repo/shared';

export const channels = pgTable('channels', {
  id: varchar('id').primaryKey(),
  lang2: varchar('lang', { enum: SUPPORT_LANGUAGES }).unique().notNull(),
});
