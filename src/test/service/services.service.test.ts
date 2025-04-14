import { DateTime } from 'luxon';
import { Product } from "../../app/model/enum/booking.enum";
import { getAvailabilityForDate } from "../../app/service/services.service";

describe('services.service.ts # getAvailabilityForDate', () => {

    test('happy path', async () => {
        const date = DateTime.fromISO('2025-04-08T17:13:58.000-03:00');
        const products = [ Product.jet_sky, Product.quad ];

        const res = await getAvailabilityForDate(date, products);

        expect(res.products.jet_sky).toHaveProperty('17:15');
        expect(res.products.quad).toHaveProperty('17:15');
    });

    test('no time available', async () => {
        const date = DateTime.fromISO('2025-04-08T18:13:58.000-03:00');
        const products = [ Product.jet_sky ];

        const res = await getAvailabilityForDate(date, products);

        expect(res.firstSlot).toEqual(undefined);
        expect(res.lastSlot).toEqual(undefined);
        expect(res.products).toEqual(undefined);
    });

    test('used stock', async () => {
        const date = DateTime.fromISO('2025-04-12T09:50:58.000-03:00');
        const products = [ Product.jet_sky ];

        const res = await getAvailabilityForDate(date, products);

        expect(res.products?.jet_sky?.['14:30']?.available).toEqual(2);
        expect(res.products?.jet_sky?.['14:45']?.available).toEqual(1);
        expect(res.products?.jet_sky?.['15:00']?.available).toEqual(1);
        expect(res.products?.jet_sky?.['15:15']?.available).toEqual(1);
        expect(res.products?.jet_sky?.['15:30']?.available).toEqual(2);
    });

});
