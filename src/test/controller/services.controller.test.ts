import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { DateTime } from 'luxon';
import { Product } from "../../app/model/enum/booking.enum";
import { AvailabilityResponseDto, getAvailabilityForDate } from "../../app/controller/services.controller";
import { shutdownDbAfter, startDbBefore } from "../config/setup";

describe('services.controller.ts # getAvailabilityForDate', () => {
    beforeAll(startDbBefore);
    afterAll(shutdownDbAfter);

    let res: AvailabilityResponseDto;

    test('happy path', async () => {
        const date = DateTime.fromISO('2025-04-08T17:13:58.000-03:00');
        const products = [ Product.jet_sky, Product.quad ];

        res = await getAvailabilityForDate(date, products);

        expect(res.products.jet_sky).toHaveProperty('17:15');
        expect(res.products.quad).toHaveProperty('17:15');
    });

    test('no time available', async () => {
        const date = DateTime.fromISO('2025-04-08T18:13:58.000-03:00');
        const products = [ Product.jet_sky ];

        res = await getAvailabilityForDate(date, products);

        expect(res.firstSlot).eq(undefined);
        expect(res.lastSlot).eq(undefined);
        expect(res.products).eq(undefined);
    });

    test('used stock', async () => {
        const date = DateTime.fromISO('2025-04-12T09:50:58.000-03:00');
        const products = [ Product.jet_sky ];

        res = await getAvailabilityForDate(date, products);

        expect(res.products?.jet_sky?.['14:30']?.available).eq(2);
        expect(res.products?.jet_sky?.['14:45']?.available).eq(1);
        expect(res.products?.jet_sky?.['15:00']?.available).eq(1);
        expect(res.products?.jet_sky?.['15:15']?.available).eq(1);
        expect(res.products?.jet_sky?.['15:30']?.available).eq(2);
    });

} )

