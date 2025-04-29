import { Request, Response } from "express";
import { DateTime } from 'luxon';
import { getAvailabilityForProductFromFirstSlot } from "@service/services.service";
import { Accessory, Product } from "@enum/business-rules.enum";

export async function getServicesAvailability(req: Request, res: Response) {
    const date = DateTime.fromISO(req.query.date as string);
    const products = req.query.products as Product[];

    await getAvailabilityForProductFromFirstSlot(date, products)
        .then(availability => res.status(200).json(availability))
        .catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error('Error checking availability:', error.message || error);
        });
}

export type ProductAvailability = {
    [time: string]: {
        available: string[];
        accessories: {
            [A in Accessory]?: string[];
        }[];
    };
};

export type AvailabilityResponseDto = {
    firstSlot?: DateTime;
    lastSlot?: DateTime;
    products: {
        [P in Product]?: ProductAvailability
    }
};
