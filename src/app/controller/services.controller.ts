import { Request, Response } from "express";
import { DateTime } from 'luxon';
import { Accessory, Product } from "@model/enum/booking.enum";
import { getAvailabilityForDate } from "@service/services.service";

export async function getServicesAvailability(req: Request, res: Response) {
    const date = DateTime.fromISO(req.query.date as string);
    const products = (Array.isArray(req.query.products) ? req.query.products : [ req.query.products ]) as Product[];

    try {
        const availability = await getAvailabilityForDate(date, products);
        res.status(200).json(availability);
        return;
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
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
