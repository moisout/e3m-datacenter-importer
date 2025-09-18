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
});

await migrate(drizzleDb, { migrationsFolder: 'drizzle' });

await Sidequest.build(E3MFetchJob)
  .unique(true)
  .maxAttempts(1)
  .enqueue();
  // .schedule('*/15 * * * *');
