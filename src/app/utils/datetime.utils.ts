import { DateTime } from 'luxon';

const toLuxonDateTime = (date: Date) => DateTime.fromJSDate(date);

const fromLuxonDateTime = (dt: DateTime | string | Date) => {
    if (dt instanceof DateTime) return dt.toJSDate();
    if (typeof dt === 'string') return DateTime.fromISO(dt).toJSDate();
    return dt;
};

export const mongooseLuxonDateHook = {
    get: toLuxonDateTime,
    set: fromLuxonDateTime,
}

export function areAllSameDay(dates: DateTime[]): boolean {
    if (dates.length === 0) return true; // no hay fechas, se considera válido

    const referenceDate = dates[0].startOf('day');

    return dates.every(date => date.startOf('day').equals(referenceDate));
}
