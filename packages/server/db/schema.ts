import { integer, numeric, pgTable } from 'drizzle-orm/pg-core';

export const electricityTable = pgTable('electricity', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  timestamp: integer().notNull(),
  value: numeric({ precision: 18, scale: 16 }).notNull(),
  sum: numeric({ precision: 24, scale: 16 }).notNull(),
});
