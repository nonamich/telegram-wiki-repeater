import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const chat = pgTable('chat', {
  chatId: integer('chatId').primaryKey(),
  lang: varchar('lang', { length: 2 }).notNull(),
});
