import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { DateTime } from 'luxon';
import { Accessory, Product } from "@model/enum/booking.enum";
import { getAvailabilityForDate } from "@service/services.service";

export async function getServicesAvailability(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array() });
        return;
    }
    const date = DateTime.fromISO(req.query.date as string);
    const products = (Array.isArray(req.query.products) ? req.query.products : [ req.query.products ]) as Product[];

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
