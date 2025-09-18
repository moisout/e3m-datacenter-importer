import { Job } from 'sidequest';

import { fetchData } from '@e3m/fetcher';
import dayjs from 'dayjs';
import { storeHourlyData } from '../store/storeHourlyData.ts';

export class E3MFetchJob extends Job {
  async run() {
    const start = performance.now();
    const rawData = await fetchData();

    const hourlyData = rawData.find((item) =>
      item.data.title.includes('Tagesverlauf Stromverbrauch')
    );

    if (!hourlyData?.data) {
      throw new Error('No hourly data found in the fetched data');
    }

    await storeHourlyData(hourlyData.data);

    const end = performance.now();
    const runtime = end - start;
    return {
      success: true,
      timestamp: dayjs().toISOString(),
      runtime: `${runtime.toFixed(2)}ms`,
      dataLength: rawData.length,
    };
  }
}
