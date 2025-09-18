import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Sidequest } from 'sidequest';
import { drizzleDb } from './src/drizzle.ts';
import { E3MFetchJob } from './src/jobs/E3MFetchJob.ts';

await Sidequest.start({
  backend: {
    driver: '@sidequest/postgres-backend',
    config:
      process.env.DATABASE_URL ||
      'postgres://e3m_user:e3m_password@localhost:5456/e3m_db',
  },
  logger: {
    level: 'info',
  },
});

await migrate(drizzleDb, { migrationsFolder: 'drizzle' });

const e3mFetchJob = Sidequest.build(E3MFetchJob).unique(true).maxAttempts(1);

setInterval(
  () => {
    e3mFetchJob.enqueue();
  },
  1000 * 60 * 15 // every 15 minutes
);
