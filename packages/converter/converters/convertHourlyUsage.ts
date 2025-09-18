import dayjs from 'dayjs';
import type { DatumData } from '../types/SourceTypes.ts';

export const convertHourlyUsage = (
  data: DatumData,
  latestDbTimestamp?: number
) => {
  const quarterHourlyData = new Map<number, number>();

  for (const item of data.subitems[0].data.series[0].data) {
    if (item[0] && item[1] && !isNaN(item[0]) && !isNaN(item[1])) {
      const timestamp = item[0];
      const value = item[1];

      const existing = quarterHourlyData.get(timestamp);

      if (existing) {
        if (value > existing) {
          quarterHourlyData.set(timestamp, value);
        }
      } else {
        quarterHourlyData.set(timestamp, value);
      }
    }
  }

  const hourlyData = new Map<number, number>();
  Array.from(quarterHourlyData)
    .sort((a, b) => a[0] - b[0])
    .forEach(([unix, val]) => {
      const hourStamp = dayjs(unix).startOf('hour').valueOf();
      const existingValue = hourlyData.get(hourStamp) ?? 0;
      hourlyData.set(hourStamp, existingValue + val);
    });

  let startTimestamp = Array.from(hourlyData.keys()).sort()[0];

  if (latestDbTimestamp && latestDbTimestamp <= startTimestamp) {
    startTimestamp = latestDbTimestamp;
  }

  startTimestamp = dayjs(startTimestamp)
    .subtract(2, 'days')
    .startOf('day')
    .valueOf();
  const hoursNr = dayjs().endOf('day').diff(startTimestamp, 'hour');

  const resultMap = new Map<
    number,
    {
      value: number;
      sum: number;
    }
  >();

  for (let i = 0; i < hoursNr; i++) {
    const timestamp = startTimestamp + i * 3600 * 1000;
    resultMap.set(timestamp, {
      value: 0,
      sum: 0,
    });
  }

  for (const [timestamp, value] of hourlyData) {
    resultMap.set(timestamp, { value, sum: 0 });
  }

  return { resultMap, startTimestamp, hoursNr };
};
