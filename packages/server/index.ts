import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Sidequest } from 'sidequest';
import { E3MFetchJob } from './jobs/E3MFetchJob.ts';
import { drizzleDb } from './src/drizzle.ts';

await Sidequest.start({
  backend: {
    driver: '@sidequest/postgres-backend',
    config:
      process.env.DATABASE_URL ||
      'postgres://e3m_user:e3m_password@localhost:5456/e3m_db',
  },
});

await migrate(drizzleDb, { migrationsFolder: 'drizzle' });

Sidequest.build(E3MFetchJob).unique(true).enqueue();
