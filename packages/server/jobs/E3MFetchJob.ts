import { Job } from 'sidequest';

import { drizzleDb } from '../src/drizzle.ts';

export class E3MFetchJob extends Job {
  async run() {
    console.log('E3MFetchJob running');

    return { success: true, timestamp: Date.now() };
  }
}
