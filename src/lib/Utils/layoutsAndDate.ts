// imports from vendors
import { DateTime } from 'luxon';

//* Generates DayTime dates array
export const formDatesArray = (date: Date, daysNumber: number) => {
  const DAYS: DateTime[] = [] ;
  for (let i = 0; i < daysNumber; i++) {
    DAYS.push(DateTime.local());
  }

  return DAYS.map((day, index) => day.set({
    day:date.getDate() + index,
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }));
};

//* Converts isoString date ranges array to DateTime range array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StringTimeRangeToDateTime = (timeRange: any[], timeZone?: string) => timeRange.map(
  (range) => ({
    ...range,
    cancelledAt: range?.cancelledAt ? DateTime.fromISO(range.cancelledAt).setZone(timeZone || range?.timeZone) : null,
    from: DateTime.fromISO(range.from).setZone(timeZone || range?.timeZone),
    to: DateTime.fromISO(range.to).setZone(timeZone || range?.timeZone),
  })
);
