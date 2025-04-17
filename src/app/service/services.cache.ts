import { AvailabilityResponseDto, ProductAvailability } from "@controller/services.controller";
import { DateTime } from "luxon";
import { BookingStatus, Product } from "@enum/booking.enum";
import { Booking } from "@model/booking.model";
import { Stock } from "@model/stock.model";
import crypto from "crypto";
import { getAvailabilityForProductByDate } from "@service/services.service";

export const productAvailabilityByDateTimeCache = new Map<string, ProductAvailability>();

async function calculateKey(searchDay: DateTime, product: Product): Promise<string> {
    const bookingIdsKey = await Booking.find({
        product: { type: product },
        startTime: {
            $gte: searchDay.startOf('day').toJSDate(),
            $lte: searchDay.endOf('day').toJSDate()
        },
        status: BookingStatus.ACTIVE
    }).select('_id').sort({ _id: 1 });
    const stockIdsKey = await Stock.find({ active: true }).select('_id').sort({ _id: 1 });

    return crypto.createHash('sha256').update(searchDay.startOf('day').toJSDate() + product + JSON.stringify(bookingIdsKey) + JSON.stringify(stockIdsKey)).digest('hex');
}

export async function getAvailabilityFromCache(searchDate: DateTime, products: Product[]): Promise<AvailabilityResponseDto> {
    const result = { products: { } } as AvailabilityResponseDto;
    for (const product of products) {
        const key = await calculateKey(searchDate, product);
        if (!productAvailabilityByDateTimeCache.has(key)) {
            console.log(`Cache not found for product ${product} by date ${searchDate.startOf('day').toFormat("yyyy-MM-dd")}. Fetching from DB...`);
            productAvailabilityByDateTimeCache.set(key, await getAvailabilityForProductByDate(searchDate, product));
        }
        const productDispo = productAvailabilityByDateTimeCache.get(key);

        if (productDispo && Object.keys(productDispo).length) {
            result.products[product] = productAvailabilityByDateTimeCache.get(key);
        }
    }
    return result;
}
