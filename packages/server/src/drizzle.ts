import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema.ts';

const drizzleDb = drizzle(process.env.DATABASE_URL!, { schema });

export { drizzleDb };
