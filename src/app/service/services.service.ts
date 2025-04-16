import { DateTime } from "luxon";
import { Product } from "@enum/booking.enum";
import { getBusinessRules } from "@service/business-rules.service";
import { Stock } from "@model/stock.model";
import { Booking } from "@model/booking.model";
import { AvailabilityResponseDto } from "@controller/services.controller";

export async function getAvailabilityForDateTime(date: DateTime, products: Product[]) {
    const businessRules = await getBusinessRules();
    const config = {
        openHour: businessRules?.openHour as string,
        slotStep: businessRules?.slotStep as number
    };

    const [ openHour, openMin ] = config?.openHour?.split(':').map(Number) || [];
    const dateOpenHour = date.set({ hour: openHour, minute: openMin, second: 0, millisecond: 0 });

    const firstSlot = ((date: DateTime): DateTime => {
        if (date.hasSame(DateTime.now(), 'day')) { // Si es hoy
            if (date < dateOpenHour) { // Si es antes de la hora de apertura
                return dateOpenHour; // Devuelvo la hora de apertura
            } else {
                const startMinute =  date.minute + 1; // Redondeo para arriba, asumiendo que estamos pasados del minuto en al menos 1 milisegundo
                const extraMinutes = startMinute % config.slotStep; // Minutos tarde del slot anterior

                return date
                    .set({ minute: startMinute, second: 0, millisecond: 0 }) // Redondeo para arriba
                    .plus({ minutes: extraMinutes ? config.slotStep - extraMinutes : 0 }); // Redondeo al slot más cercano
            }
        }
        return dateOpenHour; // Si no es hoy, devuelvo la hora de apertura
    })(date);

    const result = await getAvailabilityFromFirstSlot(firstSlot, products);

    console.log(`Service availability checked for date ${date.toISO()} and products ${products.join(', ')} retrieved successfully. [${JSON.stringify(result)}]`);

    return result;
}

export async function getAvailabilityFromFirstSlot(firstSlot: DateTime, products: Product[]) {
    const businessRules = await getBusinessRules();
    const config = {
        closeHour: businessRules?.closeHour as string,
        slotStep: businessRules?.slotStep as number,
        slotDuration: businessRules?.slotDuration as number,
        products: businessRules?.products
    };

    const [ closeHour, closeMin ] = config?.closeHour?.split(':').map(Number) || [];
    const dateCloseHour = firstSlot.set({ hour: closeHour, minute: closeMin, second: 0, millisecond: 0 });

    const slots: DateTime[] = [];

    for (let t = firstSlot; t.plus({ minutes: config?.slotDuration }) <= dateCloseHour; t = t.plus({ minutes: config?.slotStep })) {
        slots.push(t);
    }
    const result = {} as AvailabilityResponseDto;

    if (!slots.length) return result;

    result.firstSlot = slots[0];
    result.lastSlot = slots[slots.length - 1];
    result.products = {};

    for (const product of products) {
        result.products[product] = {};

        // 1 Busco el stock activo de cada producto
        const allProductStock = await Stock.find({
            type: product,
            category: 'product',
            active: true
        }).select('_id');
        // 2 Me quedo solo con los ids
        const productStockIds = allProductStock.map(s => s._id.toString());

        for (const slotStart of slots) {
            result.products[product][slotStart.toISO() as string] = {} as any;
            const slotEnd = slotStart.plus({ minutes: config?.slotDuration });

            /**
             * Necesito encontrar los bookings donde
             * se usen los stockId filtrados
             * una de las dos:
             *  1. startTime <= slotStart  && endTime > slotStart
             *  2. startTime < slotEnd && endTime >= slotEnd
             * mot cancelled
             */
            const bookingFilter = {
                status: { $ne: 'cancelled' },
                $or: [ {
                    startTime: { $lte: slotStart },
                    endTime: { $gt: slotStart }
                }, {
                    startTime: { $lt: slotEnd },
                    endTime: { $gte: slotEnd }
                }, {
                    startTime: { $gte: slotStart },
                    endTime: { $lte: slotEnd }
                } ]
            }

            const conflictingBookings = await Booking.find({
                'product.stockId': { $in: productStockIds },
                ...bookingFilter
            }).select('product.stockId');

            const occupiedProductIds = conflictingBookings.map(b => b.product?.stockId.toString());
            const availableProductIds = productStockIds.filter(id => !occupiedProductIds.includes(id));

            result.products[product][slotStart.toISO() as string].available = availableProductIds.length;

            // ACCESORIOS
            const accesoriesOfProduct = config?.products?.get(product)?.accessories || [];

            if (!accesoriesOfProduct) {
                return result;
            }

            const accessoriesResult = [];

            for (const acc of accesoriesOfProduct) {
                const allAccStock = await Stock.find({
                    type: acc,
                    category: 'accessory',
                    active: true
                }).select('_id');
                const accStockIds = allAccStock.map(s => s._id.toString());

                if (!accStockIds.length) {
                    accessoriesResult.push({ [acc]: 0 });
                    continue;
                }

                const accBooked = await Booking.find({
                    'passengers.accessories.stockId': { $in: accStockIds },
                    ...bookingFilter
                });

                const usedIds = new Set(
                    accBooked.flatMap(b =>
                        b.passengers.flatMap(p =>
                            p.accessories.filter(a => a.type === acc)
                                .map(a => a.stockId.toString())
                        )
                    )
                );

                const available = accStockIds.filter(id => !usedIds.has(id));
                accessoriesResult.push({ [acc]: available.length });
            }

            result.products[product][slotStart.toISO() as string].accessories = accessoriesResult;
        }
    }

    return result;
}

