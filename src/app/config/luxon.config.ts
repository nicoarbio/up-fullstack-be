import { DateTime, Settings } from 'luxon';

Settings.defaultLocale = 'es-AR';
Settings.defaultZone = 'America/Argentina/Buenos_Aires';

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
