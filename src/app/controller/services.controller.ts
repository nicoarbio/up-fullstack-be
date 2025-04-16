import { Request, Response } from "express";
import { DateTime } from 'luxon';
import { Accessory, Product } from "@model/enum/booking.enum";
import { getAvailabilityForDateTime } from "@service/services.service";

export async function getServicesAvailability(req: Request, res: Response) {
    const date = DateTime.fromISO(req.query.date as string);
    const products = req.query.products as Product[];

    await getAvailabilityForDateTime(date, products)
        .then(availability => res.status(200).json(availability))
        .catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error('Error checking availability:', error.message || error);
        });
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
