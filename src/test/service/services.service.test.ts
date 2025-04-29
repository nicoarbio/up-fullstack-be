import { DateTime } from 'luxon';
import { Product } from "../../app/model/enum/business-rules.enum";
import { getAvailabilityForProductFromFirstSlot } from "../../app/service/services.service";

describe('services.service.ts # getAvailabilityForDate', () => {

    test('happy path', async () => {
        const date = DateTime.fromISO('2025-04-08T17:13:58.000-03:00');
        const expectedDate = date.set({ hour: 17, minute: 15, second: 0, millisecond: 0 }).toISO() as string;
        const products = [ Product.jet_sky, Product.quad ];

        const res = await getAvailabilityForProductFromFirstSlot(date, products);
        expect(res.products.jet_sky![expectedDate]).toBeDefined();
        expect(res.products.quad![expectedDate]).toBeDefined();
    });

    test('no time available', async () => {
        const date = DateTime.now().set({ hour: 18, minute: 58 });
        const products = [ Product.jet_sky ];

        const res = await getAvailabilityForProductFromFirstSlot(date, products);


        expect(res.firstSlot).toEqual(undefined);
        expect(res.lastSlot).toEqual(undefined);
        expect(res.products).toEqual(undefined);
    });

    test('used stock', async () => {
        const date = DateTime.fromISO('2025-04-12T09:50:58.000-03:00');
        const expectedDates = {
            "14:30": date.set({ hour: 14, minute: 30, second: 0, millisecond: 0 }).toISO() as string,
            "14:45": date.set({ hour: 14, minute: 45, second: 0, millisecond: 0 }).toISO() as string,
            "15:00": date.set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toISO() as string,
            "15:15": date.set({ hour: 15, minute: 15, second: 0, millisecond: 0 }).toISO() as string,
            "15:30": date.set({ hour: 15, minute: 30, second: 0, millisecond: 0 }).toISO() as string
        }
        const products = [ Product.jet_sky ];

        const res = await getAvailabilityForProductFromFirstSlot(date, products);

        expect(res.products?.jet_sky?.[expectedDates['14:30']]?.available.length).toEqual(2);
        expect(res.products?.jet_sky?.[expectedDates['14:45']]?.available.length).toEqual(1);
        expect(res.products?.jet_sky?.[expectedDates['15:00']]?.available.length).toEqual(1);
        expect(res.products?.jet_sky?.[expectedDates['15:15']]?.available.length).toEqual(1);
        expect(res.products?.jet_sky?.[expectedDates['15:30']]?.available.length).toEqual(2);
    });

});
