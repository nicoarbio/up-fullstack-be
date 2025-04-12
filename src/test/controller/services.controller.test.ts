import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { DateTime } from 'luxon';
import { Product } from "../../app/model/enum/booking.enum";
import { AvailabilityResponseDto, getAvailabilityForDate } from "../../app/controller/services.controller";
import { shutdownDbAfter, startDbBefore } from "../setup";

describe('services.controller.ts # getAvailabilityForDate', () => {
    beforeAll(startDbBefore);
    afterAll(shutdownDbAfter);

    const products = [ Product.jet_sky, Product.quad ];
    let res: AvailabilityResponseDto;

    test('happy path', async () => {
        const date = DateTime.fromISO('2025-04-08T17:13:58.000Z');
        res = await getAvailabilityForDate(date, products);
        expect(res.products.jet_sky).toHaveProperty('17:15');
    });

    test('no time available', async () => {
        const date = DateTime.fromISO('2025-04-08T18:13:58.000Z');
        res = await getAvailabilityForDate(date, products);
        expect(res.firstSlot).eq(undefined);
        expect(res.lastSlot).eq(undefined);
        expect(res.products).eq(undefined);
    });

} )

