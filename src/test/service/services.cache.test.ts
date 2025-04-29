import { DateTime } from 'luxon';
import { Product } from "../../app/model/enum/business-rules.enum";
import { getAvailabilityFromCache, productAvailabilityByDateTimeCache } from "../../app/service/services.cache";

describe('services.cache.ts # getAvailabilityFromCache', () => {

    test('happy path', async () => {
        const date = DateTime.fromISO('2025-04-12T17:13:58.000-03:00');
        const products = [ Product.jet_sky, Product.quad ];
        expect(productAvailabilityByDateTimeCache.size).toEqual(0);
        await getAvailabilityFromCache(date, products);
        expect(productAvailabilityByDateTimeCache.size).toEqual(2);
        await getAvailabilityFromCache(date, products);
        expect(productAvailabilityByDateTimeCache.size).toEqual(2);
        await getAvailabilityFromCache(date, [ ...products, Product.surfboard_adult ]);
        expect(productAvailabilityByDateTimeCache.size).toEqual(3);
        await getAvailabilityFromCache(date, [ Product.jet_sky ]);
        expect(productAvailabilityByDateTimeCache.size).toEqual(3);
        await getAvailabilityFromCache(date, [ Product.quad ]);
        expect(productAvailabilityByDateTimeCache.size).toEqual(3);
    });

});
