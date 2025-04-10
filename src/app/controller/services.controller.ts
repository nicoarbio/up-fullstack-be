import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { DateTime } from 'luxon';
import { Product } from "../model/enum/booking.enum.js";
import { Stock } from "../model/stock.model.js";
import { Booking } from "../model/booking.model.js";
import { getProductRules } from "../service/product-rules.service.js";
import { getBusinessRules } from "../service/business-rules.service.js";

export async function getServicesAvailability(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
        return;
    }

    const { date } = req.query;
    const products = Array.isArray(req.query.products) ? req.query.products : [req.query.products];

    try {
        const availability = await getAvailabilityForDate(date as string, products as Product[]);
        res.json(availability);
        return;
    } catch (err) {
        console.error('Error checking availability:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
}

async function getAvailabilityForDate(
    date: string,
    products: Product[]
) {
    const config = await getBusinessRules();
    const slots: string[] = [];
    const start = DateTime.fromISO(`${date}T${config?.openHour}`);
    const end = DateTime.fromISO(`${date}T${config?.closeHour}`);

    for (let t = start; t.plus({ minutes: config?.slotDuration }) <= end; t = t.plus({ minutes: config?.slotStep })) {
        slots.push(t.toFormat('HH:mm'));
    }

    const result: Record<string, any> = {};

    const productRules = await getProductRules();

    for (const slot of slots) {
        const slotStart = DateTime.fromISO(`${date}T${slot}`);
        const slotEnd = slotStart.plus({ minutes: config?.slotDuration });
        result[slot] = {};

        for (const product of products) {

            const allProductStock = await Stock.find({ type: product, category: 'product', status: 'available', active: true });
            const productStockIds = allProductStock.map(s => s._id.toString());

            const conflictingBookings = await Booking.find({
                'product.stockId': { $in: productStockIds },
                startTime: { $lt: slotEnd.toJSDate() },
                endTime: { $gt: slotStart.toJSDate() },
                status: { $ne: 'cancelled' }
            });

            const occupiedProductIds = conflictingBookings.map(b => b.product?.stockId.toString());
            const availableProductIds = productStockIds.filter(id => !occupiedProductIds.includes(id));

            const accessoriesResult = [];

            for (const acc of productRules[product].accessories) {
                const allAccStock = await Stock.find({ type: acc, category: 'accessory', status: 'available', active: true });
                const accStockIds = allAccStock.map(s => s._id.toString());

                const accBooked = await Booking.find({
                    'passengers.accessories.stockId': { $in: accStockIds },
                    startTime: { $lt: slotEnd.toJSDate() },
                    endTime: { $gt: slotStart.toJSDate() },
                    status: { $ne: 'cancelled' }
                });

                const usedIds = new Set(
                    accBooked.flatMap(b =>
                        b.passengers.flatMap(p =>
                            p.accessories.filter(a => a.type === acc).map(a => a.stockId.toString())
                        )
                    )
                );

                const available = accStockIds.filter(id => !usedIds.has(id)).length;
                accessoriesResult.push({ [acc]: available });
            }

            result[slot][product] = {
                available: availableProductIds.length,
                accessories: accessoriesResult
            };
        }
    }

    return result;
}

