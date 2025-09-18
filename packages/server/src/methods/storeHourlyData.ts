import { convertHourlyUsage } from '@e3m/converter';
import type { DatumData } from '@e3m/converter/types/SourceTypes.ts';
import dayjs from 'dayjs';
import { and, asc, desc, gte, lt, lte, sql } from 'drizzle-orm';
import { logger } from 'sidequest';
import { electricityTable } from '../../db/schema.ts';
import { drizzleDb } from '../drizzle.ts';

export const storeHourlyData = async (rawHourlyData: DatumData) => {
  const log = logger('storeHourlyData');
  log.info('Storing hourly data...');
  const latestDbEntry = await drizzleDb
    .select({
      maxTimestamp: electricityTable.timestamp,
    })
    .from(electricityTable)
    .orderBy(desc(electricityTable.timestamp))
    .limit(1);

  const latestDbTimestamp = latestDbEntry[0]?.maxTimestamp;

  const { resultMap, startTimestamp, hoursNr } = convertHourlyUsage(
    rawHourlyData,
    latestDbTimestamp
  );

  const endTimestamp = dayjs(startTimestamp)
    .add(hoursNr, 'hour')
    .endOf('hour')
    .valueOf();

  if (!resultMap) {
    throw new Error('No hourly data found in the fetched data');
  }

  const dbRange = await drizzleDb
    .select({
      timestamp: electricityTable.timestamp,
      value: electricityTable.value,
      sum: electricityTable.sum,
    })
    .from(electricityTable)
    .orderBy(asc(electricityTable.timestamp))
    .where(
      and(
        gte(electricityTable.timestamp, startTimestamp),
        lte(electricityTable.timestamp, endTimestamp)
      )
    );

  let sumNr: number | undefined;

  const sumEntry = await drizzleDb
    .select({
      sum: electricityTable.sum,
    })
    .from(electricityTable)
    .orderBy(desc(electricityTable.timestamp))
    .where(lt(electricityTable.timestamp, startTimestamp))
    .limit(1);

  if (sumEntry[0]?.sum) {
    sumNr = parseFloat(sumEntry[0].sum);
  } else {
    sumNr = 0;
  }

  for (const { sum, timestamp, value } of dbRange) {
    const newResult = resultMap.get(timestamp);
    if (newResult) {
      const dbValue = parseFloat(value);

      if (dbValue > 0 && dbValue > newResult.value) {
        resultMap.set(timestamp, {
          value: dbValue,
          sum: 0,
        });
      }
    }
  }

  const entriesToInsert: { timestamp: number; value: string; sum: string }[] =
    [];

  Array.from(resultMap)
    .sort((a, b) => a[0] - b[0])
    .forEach(([timestamp, { value, sum }]) => {
      if (sumNr === undefined) {
        sumNr = 0;
      }

      sumNr += value;

      entriesToInsert.push({
        timestamp,
        value: value.toString(),
        sum: sumNr.toString(),
      });
    });
  if (entriesToInsert.length > 0) {
    await drizzleDb
      .insert(electricityTable)
      .values(entriesToInsert)
      .onConflictDoUpdate({
        target: electricityTable.timestamp,
        set: {
          value: sql.raw(`EXCLUDED.${electricityTable.value.name}`),
          sum: sql.raw(`EXCLUDED.${electricityTable.sum.name}`),
        },
      });
    log.info(`Inserted/Updated ${entriesToInsert.length} entries.`);
  }

  return {
    inserted: entriesToInsert.length,
    startTimestamp,
    hoursNr,
  };
};
