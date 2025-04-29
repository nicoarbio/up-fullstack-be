import { Request, Response } from "express";
import { BookingValidationRequest, validateOrderContent } from "@service/order.service";
import { ExtraType } from "@enum/business-rules.enum";
import { DateTime } from "luxon";

export async function validateOrder(req: Request, res: Response) {
    const bookings = req.body.requestedBookings as BookingValidationRequest[];
    const orderQuery = {
        requestedBookings: bookings.map((b: any) => ({
            ...b,
            slotStart: DateTime.fromISO(b.slotStart)
        })),
        extraIds: req.body.extraIds as ExtraType[]
    }
    await validateOrderContent(orderQuery.requestedBookings, orderQuery.extraIds)
        .then(orderStatus => {
            if ("outOfStock" in orderStatus && orderStatus.outOfStock) {
                res.status(409).json(orderStatus);
            } else {
                res.status(200).json(orderStatus);
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error('Error validating order:', error.message || error);
        })
}

export async function createOrder(req: Request, res: Response) {
    res.status(501).json({ message: "Not implemented" }); // TODO: Next step
}
