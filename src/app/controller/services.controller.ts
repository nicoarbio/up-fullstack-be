import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { DateTime } from 'luxon';
import { Accessory, Product } from "@model/enum/booking.enum";
import { Stock } from "@model/stock.model";
import { Booking } from "@model/booking.model";
import { getBusinessRules } from "@service/business-rules.service";

export async function getServicesAvailability(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
        return;
    }
    const date = DateTime.fromISO(req.query.date as string);
    const products = (Array.isArray(req.query.products) ? req.query.products : [req.query.products]) as Product[];

    try {
        const availability = await getAvailabilityForDate(date, products);
        res.status(200).json(availability);
        return;
    } catch (err) {
        console.error('Error checking availability:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
}

export type AvailabilityResponseDto = {
    firstSlot: DateTime;
    lastSlot: DateTime;
    products: {
        [key in Product]?: {
            [time: string]: {
                available: number;
                accessories: {
                    [A in Accessory]?: number;
                }[];
            };
        };
    };
};
// TODO: NO FUNCIONA BIEN, REVISAR CON EJEMPLO DE STOCK EN JSON
async function getAvailabilityForDate(date: DateTime, products: Product[]) {
    const config = await getBusinessRules();

    const [ startHour, startMin ] = config?.openHour?.split(':').map(Number) || [];
    const [ endHour, endMin ] = config?.closeHour?.split(':').map(Number) || [];

    const start = date.set({ hour: startHour, minute: startMin });
    const end= date.set({ hour: endHour, minute: endMin });

    const slots: DateTime[] = [];

    for (let t = start; t.plus({ minutes: config?.slotDuration }) <= end; t = t.plus({ minutes: config?.slotStep })) {
        slots.push(t);
    }
    const result = {} as AvailabilityResponseDto;

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
                $or: [{
                    startTime: { $lte: slotStart },
                    endTime: { $gt: slotStart }
                }, {
                    startTime: { $lt: slotEnd },
                    endTime: { $gte: slotEnd }
                }]
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
                    $or: [{
                        startTime: { $lte: slotStart },
                        endTime: { $gt: slotStart }
                    }, {
                        startTime: { $lt: slotEnd },
                        endTime: { $gte: slotEnd }
                    }]
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

