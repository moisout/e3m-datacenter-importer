import { drizzle } from 'drizzle-orm/node-postgres';

const drizzleDb = drizzle(process.env.DATABASE_URL!);

export { drizzleDb };
