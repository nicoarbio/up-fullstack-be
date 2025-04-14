import { DateTime } from "luxon";
import { Product } from "@enum/booking.enum";
import { getBusinessRules } from "@service/business-rules.service";
import { Stock } from "@model/stock.model";
import { Booking } from "@model/booking.model";
import { AvailabilityResponseDto } from "@controller/services.controller";

export async function getAvailabilityForDate(date: DateTime, products: Product[]) {
    const businessRules = await getBusinessRules();
    const config = {
        openHour: businessRules?.openHour as string,
        closeHour: businessRules?.closeHour as string,
        slotStep: businessRules?.slotStep as number,
        slotDuration: businessRules?.slotDuration as number,
        products: businessRules?.products
    };

    const [ startHour, startMin ] = config?.openHour?.split(':').map(Number) || [];
    const [ endHour, endMin ] = config?.closeHour?.split(':').map(Number) || [];

    const start = date
        .plus({ minutes: (config.slotStep - (date.minute % config.slotStep)) })
        .set({ second: 0, millisecond: 0 });
    const end = date.set({ hour: endHour, minute: endMin });

    const slots: DateTime[] = [];

    for (let t = start; t.plus({ minutes: config?.slotDuration }) <= end; t = t.plus({ minutes: config?.slotStep })) {
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
            result.products[product][slotStart.toFormat("HH:mm")] = {} as any;
            const slotEnd = slotStart.plus({ minutes: config?.slotDuration });

            /**
             * Necesito encontrar los bookings donde
             * se usen los stockId filtrados
             * una de las dos:
             *  1. startTime <= slotStart  && endTime > slotStart
             *  2. startTime < slotEnd && endTime >= slotEnd
             * mot cancelled
             */
            const conflictingBookings = await Booking.find({
                'product.stockId': { $in: productStockIds },
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
            }).select('product.stockId');

            const occupiedProductIds = conflictingBookings.map(b => b.product?.stockId.toString());
            const availableProductIds = productStockIds.filter(id => !occupiedProductIds.includes(id));

            result.products[product][slotStart.toFormat("HH:mm")].available = availableProductIds.length;

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

            result.products[product][slotStart.toFormat("HH:mm")].accessories = accessoriesResult;
        }
    }

    return result;
}

