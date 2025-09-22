import dayjs from 'dayjs';
import { desc } from 'drizzle-orm';
import { electricityTable } from '../../db/schema.ts';
import { drizzleDb } from '../drizzle.ts';
import { createRoute } from '../methods/createRoute.ts';

export const exportRoute = createRoute({
  method: 'GET',
  url: '/electricity_export.tsv',
  handler: async (request, reply) => {
    if (request.query.secretToken !== process.env.STATIC_FILE_TOKEN) {
      reply.status(403);
      return { error: 'Forbidden' };
    }

    let limit = 1000;
    if (request.query.limit) {
      const parsedLimit = parseInt(request.query.limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    const data = await drizzleDb
      .select({
        timestamp: electricityTable.timestamp,
        value: electricityTable.value,
        sum: electricityTable.sum,
      })
      .from(electricityTable)
      .orderBy(desc(electricityTable.timestamp))
      .limit(limit);

    const sensorName = process.env.SENSOR_NAME;

    const resultArray = data.map((entry) => {
      const start = dayjs(entry.timestamp).format('DD.MM.YYYY HH:mm');

      return {
        statistic_id: sensorName,
        unit: 'kWh',
        start,
        state: entry.value,
        sum: entry.sum,
      };
    });

    console.log(`Exporting ${resultArray.length} rows`);

    if (resultArray.length === 0) {
      return { error: 'No data available' };
    }

    const tsvContent = resultArray.map((row) => Object.values(row).join('\t'));

    const tsvHeader = Object.keys(resultArray[0]).join('\t');

    const tsvFile = [tsvHeader, ...tsvContent].join('\n');

    reply.header('Content-Type', 'text/tab-separated-values');
    reply.header(
      'Content-Disposition',
      'attachment; filename="electricity_export.tsv"'
    );

    return tsvFile;
  },
});
