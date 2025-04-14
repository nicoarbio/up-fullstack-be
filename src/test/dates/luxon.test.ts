import { DateTime } from "luxon";
import { fromLuxonDateTime, toLuxonDateTime } from "../../app/config/luxon.config";

test('test luxon dates', async () => {
    const date = DateTime.fromISO('2025-04-08T17:13:58.000-03:00');
    const converted = fromLuxonDateTime(date);
    const andBack = toLuxonDateTime(converted);

    expect(date).toEqual(andBack);
});
