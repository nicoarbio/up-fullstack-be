import { Request, Response } from "express";
import { BookingValidationRequest, createOrderAndBookings, getOrderById, validateOrderContent } from "@service/order.service";
import { ExtraType } from "@enum/business-rules.enum";
import { DateTime } from "luxon";

const prepareOrderQuery = (body: any) => {
    const bookings = body.requestedBookings as BookingValidationRequest[];
    return {
        requestedBookings: bookings.map((b: any) => ({
            ...b,
            slotStart: DateTime.fromISO(b.slotStart)
        })),
        extraIds: body.extraIds as ExtraType[]
    }
}

export async function validateOrder(req: Request, res: Response) {
    const orderQuery = prepareOrderQuery(req.body)
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
    const orderQuery = prepareOrderQuery(req.body)
    await createOrderAndBookings(req.user!, orderQuery.requestedBookings, orderQuery.extraIds)
        .then(orderStatus => {
            if ("outOfStock" in orderStatus && orderStatus.outOfStock) {
                res.status(409).json(orderStatus);
            } else {
                res.status(201).json(orderStatus);
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error('Error validating/creating order:', error.message || error);
        })
}

export async function getOrder(req: Request, res: Response) {
    const orderId = req.params.id;
    const user = req.user!;
    await getOrderById(orderId, user)
        .then(order => {
            if (!order) {
                res.status(404).json({ message: "Order not found" });
                return;
            }
            res.status(200).json(order)
        })
        .catch(error => {
            res.status(500).json({ error: error.message, detail: error.cause });
            console.error('Error getting order:', error.message || error);
        })
}
