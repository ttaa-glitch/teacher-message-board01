import { sql } from 'drizzle-orm';
import { pgTable, text, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const message = pgTable('message', {
  id: uuid('id').primaryKey().defaultRandom(),
  className: varchar('class_name', { length: 100 }).notNull(),
  content: text('content').notNull(),
  graduateYear: varchar('graduate_year', { length: 20 }),
  studentName: varchar('student_name', { length: 50 }),
  createdAt: timestamp('created_at', { precision: 3, withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
