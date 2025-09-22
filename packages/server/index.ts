import { migrate } from 'drizzle-orm/node-postgres/migrator';
import Fastify from 'fastify';
import { Sidequest } from 'sidequest';
import { drizzleDb } from './src/drizzle.ts';
import { exportRoute } from './src/export/index.ts';
import { E3MFetchJob } from './src/jobs/E3MFetchJob.ts';

await migrate(drizzleDb, { migrationsFolder: 'drizzle' });

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
  dashboard: {
    port: 8678,
  },
});

const fastify = Fastify({ logger: true });

fastify.route(exportRoute);

fastify.listen({ port: 8679, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});

const e3mFetchJob = Sidequest.build(E3MFetchJob).unique(true).maxAttempts(1);

setInterval(
  () => {
    e3mFetchJob.enqueue();
  },
  1000 * 60 * 15 // every 15 minutes
);
