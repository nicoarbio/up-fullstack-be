import { DateTime } from "luxon";
import { mongooseLuxonDateHook } from "../../app/config/luxon.config";

test('test luxon dates', async () => {
    const date = DateTime.fromISO('2025-04-08T17:13:58.000-03:00');
    const converted = mongooseLuxonDateHook.set(date);
    const andBack = mongooseLuxonDateHook.get(converted);

    expect(date).toEqual(andBack);
});
